package com.healthify.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SubstitutedIngredient {
    private Ingredient original;
    private Ingredient substitute;
    private String why;
}
