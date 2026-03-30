package com.healthify.unit;

import com.healthify.dto.*;
import com.healthify.service.SubstitutionValidator;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.ValueSource;

import java.util.List;

import static org.assertj.core.api.Assertions.*;

class SubstitutionValidatorTest {

    private SubstitutionValidator validator;

    @BeforeEach
    void setUp() {
        validator = new SubstitutionValidator();
    }

    private HealthifyResponse responseWithInstruction(String instruction) {
        SubstitutedIngredient validSub = SubstitutedIngredient.builder()
                .original(Ingredient.builder().name("butter").amount("1").unit("cup").build())
                .substitute(Ingredient.builder().name("applesauce").amount("0.75").unit("cup").build())
                .why("Cuts fat significantly.")
                .build();
        return HealthifyResponse.builder()
                .title("Test")
                .substitutedIngredients(List.of(validSub))
                .originalInstructions(List.of(instruction))
                .rewrittenInstructions(List.of(instruction))
                .safetyNotes(List.of())
                .mode("COOKING")
                .build();
    }

    @Test
    void safe_temperature_350F_passes() {
        assertThatNoException().isThrownBy(() ->
                validator.validate(responseWithInstruction("Bake at 350°F for 30 minutes.")));
    }

    @Test
    void safe_temperature_500F_passes() {
        assertThatNoException().isThrownBy(() ->
                validator.validate(responseWithInstruction("Broil at 500°F briefly.")));
    }

    @ParameterizedTest
    @ValueSource(strings = {
            "Heat oil to 600°F",
            "Cook at 700 F until done",
            "Preheat to 1000°F",
            "Set oven to 900F"
    })
    void unsafe_fahrenheit_temperatures_are_rejected(String instruction) {
        assertThatThrownBy(() -> validator.validate(responseWithInstruction(instruction)))
                .isInstanceOf(IllegalStateException.class)
                .hasMessageContaining("unsafe cooking temperature");
    }

    @ParameterizedTest
    @ValueSource(strings = {
            "Cook at 300°C",
            "Heat to 400°C",
            "Bake at 270 C"
    })
    void unsafe_celsius_temperatures_are_rejected(String instruction) {
        assertThatThrownBy(() -> validator.validate(responseWithInstruction(instruction)))
                .isInstanceOf(IllegalStateException.class)
                .hasMessageContaining("unsafe cooking temperature");
    }

    @Test
    void dangerous_deep_fry_method_is_rejected() {
        assertThatThrownBy(() -> validator.validate(responseWithInstruction("Deep fry in a large vat of oil at 400°F.")))
                .isInstanceOf(IllegalStateException.class)
                .hasMessageContaining("unsafe cooking method");
    }

    @Test
    void substitution_with_blank_name_is_rejected() {
        SubstitutedIngredient badSub = SubstitutedIngredient.builder()
                .original(Ingredient.builder().name("butter").amount("1").unit("cup").build())
                .substitute(Ingredient.builder().name("").amount("1").unit("cup").build())
                .why("Some reason.")
                .build();
        HealthifyResponse response = HealthifyResponse.builder()
                .title("Test")
                .substitutedIngredients(List.of(badSub))
                .originalInstructions(List.of("Bake at 350°F"))
                .rewrittenInstructions(List.of("Bake at 350°F"))
                .safetyNotes(List.of())
                .mode("COOKING")
                .build();

        assertThatThrownBy(() -> validator.validate(response))
                .isInstanceOf(IllegalStateException.class)
                .hasMessageContaining("incomplete substitution");
    }

    @Test
    void substitution_with_blank_why_is_rejected() {
        SubstitutedIngredient badSub = SubstitutedIngredient.builder()
                .original(Ingredient.builder().name("butter").amount("1").unit("cup").build())
                .substitute(Ingredient.builder().name("applesauce").amount("1").unit("cup").build())
                .why("  ")
                .build();
        HealthifyResponse response = HealthifyResponse.builder()
                .title("Test")
                .substitutedIngredients(List.of(badSub))
                .originalInstructions(List.of("Bake at 350°F"))
                .rewrittenInstructions(List.of("Bake at 350°F"))
                .safetyNotes(List.of())
                .mode("COOKING")
                .build();

        assertThatThrownBy(() -> validator.validate(response))
                .isInstanceOf(IllegalStateException.class)
                .hasMessageContaining("without explanation");
    }

    @Test
    void null_instructions_list_does_not_throw() {
        HealthifyResponse response = HealthifyResponse.builder()
                .title("Test")
                .substitutedIngredients(List.of())
                .originalInstructions(null)
                .rewrittenInstructions(null)
                .safetyNotes(List.of())
                .mode("COOKING")
                .build();
        assertThatNoException().isThrownBy(() -> validator.validate(response));
    }
}
