package com.healthify.bdd;

import com.healthify.dto.*;
import com.healthify.service.SubstitutionValidator;
import io.cucumber.java.en.*;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

public class SubstitutionValidatorSteps {

    @Autowired
    private SubstitutionValidator substitutionValidator;

    private HealthifyResponse response;
    private boolean validationPassed;
    private Exception caughtException;

    @Given("an AI response with instruction {string}")
    public void anAIResponseWithInstruction(String instruction) {
        SubstitutedIngredient validSub = SubstitutedIngredient.builder()
                .original(Ingredient.builder().name("butter").amount("1").unit("cup").build())
                .substitute(Ingredient.builder().name("applesauce").amount("0.75").unit("cup").build())
                .why("Applesauce reduces fat.")
                .build();

        response = HealthifyResponse.builder()
                .title("Test")
                .substitutedIngredients(List.of(validSub))
                .originalInstructions(List.of(instruction))
                .rewrittenInstructions(List.of(instruction))
                .safetyNotes(List.of())
                .mode("COOKING")
                .build();
    }

    @Given("an AI response with a substitution that has no name")
    public void anAIResponseWithASubstitutionThatHasNoName() {
        SubstitutedIngredient badSub = SubstitutedIngredient.builder()
                .original(Ingredient.builder().name("butter").amount("1").unit("cup").build())
                .substitute(Ingredient.builder().name("").amount("1").unit("cup").build())
                .why("Some reason.")
                .build();

        response = HealthifyResponse.builder()
                .title("Test")
                .substitutedIngredients(List.of(badSub))
                .originalInstructions(List.of("Bake at 350°F"))
                .rewrittenInstructions(List.of("Bake at 350°F"))
                .safetyNotes(List.of())
                .mode("COOKING")
                .build();
    }

    @Given("an AI response with a substitution that has no why explanation")
    public void anAIResponseWithASubstitutionThatHasNoWhyExplanation() {
        SubstitutedIngredient badSub = SubstitutedIngredient.builder()
                .original(Ingredient.builder().name("butter").amount("1").unit("cup").build())
                .substitute(Ingredient.builder().name("applesauce").amount("1").unit("cup").build())
                .why("")
                .build();

        response = HealthifyResponse.builder()
                .title("Test")
                .substitutedIngredients(List.of(badSub))
                .originalInstructions(List.of("Bake at 350°F"))
                .rewrittenInstructions(List.of("Bake at 350°F"))
                .safetyNotes(List.of())
                .mode("COOKING")
                .build();
    }

    @When("I validate the response")
    public void iValidateTheResponse() {
        try {
            substitutionValidator.validate(response);
            validationPassed = true;
        } catch (IllegalStateException e) {
            validationPassed = false;
            caughtException = e;
        }
    }

    @Then("validation should pass")
    public void validationShouldPass() {
        assertThat(validationPassed).isTrue();
    }

    @Then("validation should throw an IllegalStateException")
    public void validationShouldThrowAnIllegalStateException() {
        assertThat(validationPassed).isFalse();
        assertThat(caughtException).isInstanceOf(IllegalStateException.class);
    }
}
