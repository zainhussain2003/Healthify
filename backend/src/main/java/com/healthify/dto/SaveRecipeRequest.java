package com.healthify.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

@Data
public class SaveRecipeRequest {

    @NotNull
    private Long recipeId;

    @NotNull
    private HealthifyResponse healthifyResponse;

    @Min(1) @Max(5)
    private int sliderIntensity;

    @NotNull
    @Pattern(regexp = "COOKING|BAKING")
    private String mode;
}
