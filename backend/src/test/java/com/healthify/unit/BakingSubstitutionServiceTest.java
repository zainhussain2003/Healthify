package com.healthify.unit;

import com.healthify.dto.*;
import com.healthify.service.BakingSubstitutionService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.ValueSource;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.*;

class BakingSubstitutionServiceTest {

    private BakingSubstitutionService service;

    @BeforeEach
    void setUp() {
        service = new BakingSubstitutionService();
    }

    private ParsedRecipe recipeWith(String amount, String unit, String name) {
        return ParsedRecipe.builder()
                .recipeId(1L)
                .title("Test Recipe")
                .ingredients(List.of(Ingredient.builder().amount(amount).unit(unit).name(name).build()))
                .instructions(List.of("Mix well."))
                .build();
    }

    @Test
    void butter_is_substituted_with_applesauce_at_0_75_ratio() {
        HealthifyResponse response = service.substitute(recipeWith("2", "cup", "butter"), 3);

        SubstitutedIngredient sub = findSubstitution(response, "butter");
        assertThat(sub.getSubstitute().getName()).containsIgnoringCase("applesauce");
        assertThat(sub.getSubstitute().getAmount()).isEqualTo("1.5");
    }

    @Test
    void oil_is_substituted_with_applesauce_at_1_to_1_ratio() {
        HealthifyResponse response = service.substitute(recipeWith("1", "cup", "oil"), 3);

        SubstitutedIngredient sub = findSubstitution(response, "oil");
        assertThat(sub.getSubstitute().getName()).containsIgnoringCase("applesauce");
        assertThat(sub.getSubstitute().getAmount()).isEqualTo("1");
    }

    @Test
    void flour_is_substituted_with_whole_wheat_at_0_875_ratio() {
        HealthifyResponse response = service.substitute(recipeWith("2", "cup", "all-purpose flour"), 4);

        SubstitutedIngredient sub = findSubstitution(response, "all-purpose flour");
        assertThat(sub.getSubstitute().getName()).containsIgnoringCase("whole wheat");
        assertThat(sub.getSubstitute().getAmount()).isEqualTo("1.75");
    }

    @Test
    void sugar_is_substituted_with_coconut_sugar_at_intensity_3() {
        HealthifyResponse response = service.substitute(recipeWith("1", "cup", "sugar"), 3);

        SubstitutedIngredient sub = findSubstitution(response, "sugar");
        assertThat(sub.getSubstitute().getName()).containsIgnoringCase("coconut sugar");
        assertThat(sub.getSubstitute().getAmount()).isEqualTo("1");
    }

    @Test
    void milk_is_substituted_at_intensity_1() {
        HealthifyResponse response = service.substitute(recipeWith("1", "cup", "milk"), 1);

        SubstitutedIngredient sub = findSubstitution(response, "milk");
        assertThat(sub.getSubstitute().getName()).containsIgnoringCase("almond milk");
    }

    @Test
    void cinnamon_is_never_substituted() {
        HealthifyResponse response = service.substitute(recipeWith("1", "tsp", "cinnamon"), 5);
        assertThat(response.getSubstitutedIngredients()).isEmpty();
    }

    @ParameterizedTest
    @ValueSource(strings = {"butter", "oil", "sugar", "egg"})
    void high_calorie_ingredients_not_substituted_at_intensity_1(String ingredientName) {
        HealthifyResponse response = service.substitute(recipeWith("1", "cup", ingredientName), 1);
        boolean substituted = response.getSubstitutedIngredients().stream()
                .anyMatch(s -> s.getOriginal().getName().equalsIgnoreCase(ingredientName));
        assertThat(substituted).isFalse();
    }

    @Test
    void butter_substitution_includes_safety_note_about_temperature() {
        HealthifyResponse response = service.substitute(recipeWith("1", "cup", "butter"), 3);
        assertThat(response.getSafetyNotes()).anyMatch(n ->
                n.toLowerCase().contains("temperature") || n.toLowerCase().contains("°f") || n.toLowerCase().contains("oven"));
    }

    @Test
    void flour_substitution_includes_safety_note_about_liquid() {
        HealthifyResponse response = service.substitute(recipeWith("1", "cup", "flour"), 4);
        assertThat(response.getSafetyNotes()).anyMatch(n -> n.toLowerCase().contains("liquid"));
    }

    @Test
    void safety_notes_prepended_to_rewritten_instructions() {
        HealthifyResponse response = service.substitute(recipeWith("1", "cup", "butter"), 3);
        assertThat(response.getRewrittenInstructions().get(0)).contains("IMPORTANT SUBSTITUTION NOTES");
    }

    @Test
    void response_mode_is_BAKING() {
        HealthifyResponse response = service.substitute(recipeWith("1", "cup", "milk"), 1);
        assertThat(response.getMode()).isEqualTo("BAKING");
    }

    private SubstitutedIngredient findSubstitution(HealthifyResponse response, String originalName) {
        return response.getSubstitutedIngredients().stream()
                .filter(s -> s.getOriginal().getName().equalsIgnoreCase(originalName))
                .findFirst()
                .orElseThrow(() -> new AssertionError("No substitution found for: " + originalName));
    }
}
