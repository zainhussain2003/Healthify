package com.healthify.service;

import com.healthify.dto.*;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * Hardcoded, chemically vetted baking substitution database.
 * NEVER uses AI — safety-critical path.
 * Any changes here require a corresponding Cucumber scenario.
 */
@Service
@Slf4j
public class BakingSubstitutionService {

    record BakingSubstitute(String substituteName, double ratio, String unit, String why, String safetyNote) {}

    // Key: lowercase ingredient name keyword → substitute definition
    private static final Map<String, BakingSubstitute> BAKING_DB = Map.ofEntries(
            Map.entry("butter", new BakingSubstitute(
                    "unsweetened applesauce", 0.75, "same unit",
                    "Applesauce replaces butter at a 3:4 ratio, cutting fat by ~80% while maintaining moisture.",
                    "Reduce oven temperature by 25°F — applesauce burns more easily than butter.")),
            Map.entry("oil", new BakingSubstitute(
                    "unsweetened applesauce", 1.0, "same unit",
                    "Applesauce replaces oil 1:1 in baking, adding natural sweetness and cutting fat.",
                    "Baked goods will be denser and more moist — do not overbake.")),
            Map.entry("sugar", new BakingSubstitute(
                    "coconut sugar", 1.0, "same unit",
                    "Coconut sugar swaps 1:1 for white sugar with a lower glycemic index and trace minerals.",
                    null)),
            Map.entry("white sugar", new BakingSubstitute(
                    "coconut sugar", 1.0, "same unit",
                    "Coconut sugar swaps 1:1 for white sugar with a lower glycemic index.",
                    null)),
            Map.entry("all-purpose flour", new BakingSubstitute(
                    "whole wheat flour", 0.875, "same unit",
                    "Use 7/8 cup whole wheat flour per cup of all-purpose for added fibre and nutrients.",
                    "Add 2 tsp extra liquid per cup substituted — whole wheat absorbs more moisture.")),
            Map.entry("flour", new BakingSubstitute(
                    "whole wheat flour", 0.875, "same unit",
                    "Use 7/8 cup whole wheat flour per cup of all-purpose for added fibre and nutrients.",
                    "Add 2 tsp extra liquid per cup substituted — whole wheat absorbs more moisture.")),
            Map.entry("whole milk", new BakingSubstitute(
                    "unsweetened almond milk", 1.0, "same unit",
                    "Almond milk replaces whole milk 1:1, cutting calories and saturated fat significantly.",
                    null)),
            Map.entry("milk", new BakingSubstitute(
                    "unsweetened almond milk", 1.0, "same unit",
                    "Almond milk replaces milk 1:1, cutting calories and saturated fat.",
                    null)),
            Map.entry("heavy cream", new BakingSubstitute(
                    "evaporated skim milk", 1.0, "same unit",
                    "Evaporated skim milk mimics the richness of heavy cream with a fraction of the fat.",
                    "Do not whip — it will not hold peaks like heavy cream.")),
            Map.entry("cream cheese", new BakingSubstitute(
                    "low-fat Greek yogurt", 1.0, "same unit",
                    "Greek yogurt provides the same tangy creaminess as cream cheese with far less fat.",
                    "Drain yogurt through cheesecloth for 1 hour before use to reduce moisture.")),
            Map.entry("sour cream", new BakingSubstitute(
                    "plain Greek yogurt", 1.0, "same unit",
                    "Greek yogurt replaces sour cream 1:1 with more protein and less fat.",
                    null)),
            Map.entry("egg", new BakingSubstitute(
                    "flaxseed egg (1 tbsp ground flax + 3 tbsp water)", 1.0, "per egg",
                    "A flax egg binds baked goods just like a regular egg with added omega-3s.",
                    "Mix and let sit for 5 minutes until gel forms before adding to batter."))
    );

    public HealthifyResponse substitute(ParsedRecipe recipe, int sliderIntensity) {
        List<SubstitutedIngredient> substituted = new ArrayList<>();
        List<String> safetyNotes = new ArrayList<>();

        for (Ingredient ingredient : recipe.getIngredients()) {
            BakingSubstitute match = findMatch(ingredient.getName().toLowerCase());
            if (match != null && shouldSubstituteAtIntensity(ingredient.getName(), sliderIntensity)) {
                String newAmount = computeAmount(ingredient.getAmount(), match.ratio());
                substituted.add(SubstitutedIngredient.builder()
                        .original(ingredient)
                        .substitute(Ingredient.builder()
                                .name(match.substituteName())
                                .amount(newAmount)
                                .unit(ingredient.getUnit())
                                .build())
                        .why(match.why())
                        .build());
                if (match.safetyNote() != null) {
                    safetyNotes.add(match.safetyNote());
                }
            }
        }

        return HealthifyResponse.builder()
                .title(recipe.getTitle())
                .substitutedIngredients(substituted)
                .originalInstructions(recipe.getInstructions())
                .rewrittenInstructions(buildRewrittenInstructions(recipe.getInstructions(), safetyNotes))
                .safetyNotes(safetyNotes)
                .mode("BAKING")
                .build();
    }

    private BakingSubstitute findMatch(String ingredientName) {
        return BAKING_DB.entrySet().stream()
                .filter(e -> ingredientName.contains(e.getKey()))
                .map(Map.Entry::getValue)
                .findFirst()
                .orElse(null);
    }

    // Light intensity (1-2) only swaps dairy; higher intensities swap fats and flour too
    private boolean shouldSubstituteAtIntensity(String ingredientName, int intensity) {
        String lower = ingredientName.toLowerCase();
        boolean isDairy = lower.contains("milk") || lower.contains("sour cream")
                || lower.contains("yogurt") || lower.contains("cream cheese");
        boolean isFatOrSugar = lower.contains("butter") || lower.contains("oil")
                || lower.contains("sugar") || lower.contains("egg");
        boolean isFlourOrCream = lower.contains("flour") || lower.contains("heavy cream");

        if (isDairy) return intensity >= 1;
        if (isFatOrSugar) return intensity >= 3;
        if (isFlourOrCream) return intensity >= 4;
        return false;
    }

    private String computeAmount(String original, double ratio) {
        try {
            double value = Double.parseDouble(original);
            double result = value * ratio;
            if (result == Math.floor(result)) return String.valueOf((int) result);
            return String.format("%.2f", result).replaceAll("0+$", "").replaceAll("\\.$", "");
        } catch (NumberFormatException e) {
            return original;
        }
    }

    private List<String> buildRewrittenInstructions(List<String> original, List<String> safetyNotes) {
        List<String> rewritten = new ArrayList<>(original);
        if (!safetyNotes.isEmpty()) {
            rewritten.add(0, "IMPORTANT SUBSTITUTION NOTES: " + String.join(" | ", safetyNotes));
        }
        return rewritten;
    }
}
