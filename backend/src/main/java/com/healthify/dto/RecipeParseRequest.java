package com.healthify.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class RecipeParseRequest {

    private String title;

    @NotBlank(message = "Recipe text must not be empty")
    private String text;
}
