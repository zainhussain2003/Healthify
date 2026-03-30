package com.healthify.service;

import com.healthify.dto.HealthifyResponse;
import com.healthify.dto.SubstitutedIngredient;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.regex.Pattern;

/**
 * Validates AI-generated substitution output before returning to the client.
 * Guards against hallucinated unsafe temperatures and dangerous cooking methods.
 */
@Service
@Slf4j
public class SubstitutionValidator {

    // Temperatures above 500°F / 260°C are considered unsafe for consumer recipes
    // Regex matches 501-999°F and 1000+°F; 500°F is the highest safe consumer oven temperature
    private static final Pattern UNSAFE_TEMP_PATTERN =
            Pattern.compile("\\b(50[1-9]|5[1-9]\\d|[6-9]\\d{2}|[1-9]\\d{3,})\\s*°?\\s*[Ff]\\b|\\b(2[6-9]\\d|[3-9]\\d{2}|\\d{4,})\\s*°?\\s*[Cc]\\b");

    private static final List<String> DANGEROUS_METHODS = List.of(
            "deep fry in", "submerge in boiling oil", "heat oil until smoking heavily"
    );

    public HealthifyResponse validate(HealthifyResponse response) {
        validateInstructions(response.getRewrittenInstructions());
        validateSubstitutes(response.getSubstitutedIngredients());
        return response;
    }

    private void validateInstructions(List<String> instructions) {
        if (instructions == null) return;
        for (String step : instructions) {
            if (UNSAFE_TEMP_PATTERN.matcher(step).find()) {
                log.warn("SubstitutionValidator: unsafe temperature detected in step: {}", step);
                throw new IllegalStateException(
                        "AI generated an unsafe cooking temperature. Please try again.");
            }
            for (String dangerous : DANGEROUS_METHODS) {
                if (step.toLowerCase().contains(dangerous)) {
                    log.warn("SubstitutionValidator: dangerous method detected: {}", step);
                    throw new IllegalStateException(
                            "AI generated an unsafe cooking method. Please try again.");
                }
            }
        }
    }

    private void validateSubstitutes(List<SubstitutedIngredient> substitutes) {
        if (substitutes == null) return;
        for (SubstitutedIngredient sub : substitutes) {
            if (sub.getSubstitute() == null || sub.getSubstitute().getName() == null
                    || sub.getSubstitute().getName().isBlank()) {
                throw new IllegalStateException("AI returned an incomplete substitution. Please try again.");
            }
            if (sub.getWhy() == null || sub.getWhy().isBlank()) {
                throw new IllegalStateException("AI returned a substitution without explanation. Please try again.");
            }
        }
    }
}
