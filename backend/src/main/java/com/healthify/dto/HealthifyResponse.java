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
public class HealthifyResponse {
    private String title;
    private List<SubstitutedIngredient> substitutedIngredients;
    private List<String> originalInstructions;
    private List<String> rewrittenInstructions;
    private List<String> safetyNotes;
    private String mode;
}
