package com.healthify.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

@Data
public class HealthifyRequest {

    @NotNull
    private ParsedRecipe recipe;

    @Min(1) @Max(5)
    private int sliderIntensity;

    @NotNull
    @Pattern(regexp = "COOKING|BAKING", message = "Mode must be COOKING or BAKING")
    private String mode;
}
