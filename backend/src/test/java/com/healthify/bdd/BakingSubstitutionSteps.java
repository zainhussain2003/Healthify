package com.healthify.bdd;

import com.healthify.dto.*;
import com.healthify.service.BakingSubstitutionService;
import io.cucumber.java.en.*;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;

public class BakingSubstitutionSteps {

    @Autowired
    private BakingSubstitutionService bakingSubstitutionService;

    private ParsedRecipe recipe;
    private HealthifyResponse response;
    private String targetIngredientName;

    @Given("a baking recipe with ingredient {string}")
    public void aBakingRecipeWithIngredient(String ingredientLine) {
        Ingredient ingredient = parseIngredientLine(ingredientLine);
        this.targetIngredientName = ingredient.getName();
        recipe = ParsedRecipe.builder()
                .recipeId(1L)
                .title("Test Recipe")
                .ingredients(List.of(ingredient))
                .instructions(List.of("Mix and bake."))
                .build();
    }

    @Given("a baking recipe with ingredients {string} and {string}")
    public void aBakingRecipeWithIngredients(String line1, String line2) {
        recipe = ParsedRecipe.builder()
                .recipeId(1L)
                .title("Test Recipe")
                .ingredients(List.of(parseIngredientLine(line1), parseIngredientLine(line2)))
                .instructions(List.of("Mix and bake."))
                .build();
    }

    @When("I healthify it in BAKING mode at intensity {int}")
    public void iHealthifyItInBakingModeAtIntensity(int intensity) {
        response = bakingSubstitutionService.substitute(recipe, intensity);
    }

    @Then("the substituted ingredient name should contain {string}")
    public void theSubstitutedIngredientNameShouldContain(String expected) {
        Optional<SubstitutedIngredient> match = response.getSubstitutedIngredients().stream()
                .filter(s -> s.getOriginal().getName().equalsIgnoreCase(targetIngredientName))
                .findFirst();
        assertThat(match).isPresent();
        assertThat(match.get().getSubstitute().getName()).containsIgnoringCase(expected);
    }

    @Then("the substituted amount should be {string}")
    public void theSubstitutedAmountShouldBe(String expected) {
        Optional<SubstitutedIngredient> match = response.getSubstitutedIngredients().stream()
                .filter(s -> s.getOriginal().getName().equalsIgnoreCase(targetIngredientName))
                .findFirst();
        assertThat(match).isPresent();
        assertThat(match.get().getSubstitute().getAmount()).isEqualTo(expected);
    }

    @Then("a safety note about oven temperature should be present")
    public void aSafetyNoteAboutOvenTemperatureShouldBePresent() {
        assertThat(response.getSafetyNotes()).anyMatch(n -> n.toLowerCase().contains("temperature") || n.toLowerCase().contains("°f") || n.toLowerCase().contains("oven"));
    }

    @Then("a safety note about extra liquid should be present")
    public void aSafetyNoteAboutExtraLiquidShouldBePresent() {
        assertThat(response.getSafetyNotes()).anyMatch(n -> n.toLowerCase().contains("liquid"));
    }

    @Then("no substitution should be made for that ingredient")
    public void noSubstitutionShouldBeMadeForThatIngredient() {
        boolean anyMatch = response.getSubstitutedIngredients().stream()
                .anyMatch(s -> s.getOriginal().getName().equalsIgnoreCase(targetIngredientName));
        assertThat(anyMatch).isFalse();
    }

    @Then("{string} should be substituted")
    public void shouldBeSubstituted(String ingredientName) {
        boolean substituted = response.getSubstitutedIngredients().stream()
                .anyMatch(s -> s.getOriginal().getName().equalsIgnoreCase(ingredientName));
        assertThat(substituted).isTrue();
    }

    @Then("{string} should not be substituted")
    public void shouldNotBeSubstituted(String ingredientName) {
        boolean substituted = response.getSubstitutedIngredients().stream()
                .anyMatch(s -> s.getOriginal().getName().equalsIgnoreCase(ingredientName));
        assertThat(substituted).isFalse();
    }

    private Ingredient parseIngredientLine(String line) {
        String[] parts = line.split(" ", 3);
        if (parts.length == 3) {
            return Ingredient.builder().amount(parts[0]).unit(parts[1]).name(parts[2]).build();
        } else if (parts.length == 2) {
            return Ingredient.builder().amount(parts[0]).unit("").name(parts[1]).build();
        }
        return Ingredient.builder().amount("").unit("").name(line).build();
    }
}
