package com.healthify.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ParsedRecipe {
    private Long recipeId;
    private String title;
    private List<Ingredient> ingredients;
    private List<String> instructions;
}
