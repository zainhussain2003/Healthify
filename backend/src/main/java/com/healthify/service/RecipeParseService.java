package com.healthify.service;

import com.healthify.dto.Ingredient;
import com.healthify.dto.ParsedRecipe;
import com.healthify.model.Recipe;
import com.healthify.model.User;
import com.healthify.repository.RecipeRepository;
import com.healthify.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
@RequiredArgsConstructor
public class RecipeParseService {

    private final RecipeRepository recipeRepository;
    private final UserRepository userRepository;

    private static final Pattern AMOUNT_PATTERN =
            Pattern.compile("^(\\d+[\\d./]*)\\s*([a-zA-Z]+\\.?)?\\s+(.+)$");

    private static final List<String> INGREDIENT_HEADERS =
            List.of("ingredients", "ingredient list", "you will need", "you'll need");

    private static final List<String> INSTRUCTION_HEADERS =
            List.of("instructions", "directions", "method", "steps", "preparation", "how to make");

    public ParsedRecipe parse(String title, String text, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        String resolvedTitle = (title != null && !title.isBlank()) ? title : extractTitle(text);

        List<String> lines = text.lines()
                .map(String::trim)
                .filter(l -> !l.isBlank())
                .toList();

        List<Ingredient> ingredients = extractIngredients(lines);
        List<String> instructions = extractInstructions(lines);

        Recipe recipe = Recipe.builder()
                .user(user)
                .title(resolvedTitle)
                .originalText(text)
                .build();
        recipe = recipeRepository.save(recipe);

        return ParsedRecipe.builder()
                .recipeId(recipe.getId())
                .title(resolvedTitle)
                .ingredients(ingredients)
                .instructions(instructions)
                .build();
    }

    private String extractTitle(String text) {
        return text.lines()
                .map(String::trim)
                .filter(l -> !l.isBlank())
                .findFirst()
                .orElse("Untitled Recipe");
    }

    private List<Ingredient> extractIngredients(List<String> lines) {
        List<Ingredient> ingredients = new ArrayList<>();
        boolean inIngredients = false;

        for (String line : lines) {
            String lower = line.toLowerCase().replaceAll("[:\\-]", "").trim();

            if (INGREDIENT_HEADERS.stream().anyMatch(lower::equals)) {
                inIngredients = true;
                continue;
            }
            if (INSTRUCTION_HEADERS.stream().anyMatch(lower::contains) && inIngredients) {
                break;
            }

            if (inIngredients && !line.isBlank()) {
                ingredients.add(parseIngredientLine(line));
            }
        }

        // Fallback: if no section headers found, try to parse all lines as ingredients
        if (ingredients.isEmpty()) {
            for (String line : lines) {
                if (looksLikeIngredient(line)) {
                    ingredients.add(parseIngredientLine(line));
                }
            }
        }

        return ingredients;
    }

    private List<String> extractInstructions(List<String> lines) {
        List<String> instructions = new ArrayList<>();
        boolean inInstructions = false;
        int stepNumber = 1;

        for (String line : lines) {
            String lower = line.toLowerCase().replaceAll("[:\\-]", "").trim();

            if (INSTRUCTION_HEADERS.stream().anyMatch(lower::equals)) {
                inInstructions = true;
                continue;
            }

            if (inInstructions && !line.isBlank()) {
                // Strip leading step numbers if present (e.g. "1.", "Step 1:")
                String cleaned = line.replaceFirst("(?i)^(step\\s*\\d+[.:]?|\\d+[.):]?)\\s*", "").trim();
                instructions.add(cleaned);
                stepNumber++;
            }
        }

        // Fallback: lines that look like sentences (long, contain verbs)
        if (instructions.isEmpty()) {
            for (String line : lines) {
                if (looksLikeInstruction(line)) {
                    instructions.add(line);
                }
            }
        }

        return instructions;
    }

    private Ingredient parseIngredientLine(String line) {
        // Strip leading bullet or dash
        String cleaned = line.replaceFirst("^[•\\-*]\\s*", "").trim();
        Matcher m = AMOUNT_PATTERN.matcher(cleaned);

        if (m.matches()) {
            return Ingredient.builder()
                    .amount(m.group(1))
                    .unit(m.group(2) != null ? m.group(2) : "")
                    .name(m.group(3))
                    .build();
        }

        return Ingredient.builder()
                .amount("")
                .unit("")
                .name(cleaned)
                .build();
    }

    private boolean looksLikeIngredient(String line) {
        return line.matches("^[\\d½⅓⅔¼¾⅛⅜⅝⅞].*") && line.length() < 80;
    }

    private boolean looksLikeInstruction(String line) {
        return line.length() > 30 && !looksLikeIngredient(line);
    }
}
