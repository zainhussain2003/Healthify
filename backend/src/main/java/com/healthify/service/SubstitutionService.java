package com.healthify.service;

import com.healthify.dto.HealthifyRequest;
import com.healthify.dto.HealthifyResponse;
import com.healthify.port.AISubstitutionPort;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class SubstitutionService {

    private final AISubstitutionPort aiSubstitutionPort;
    private final BakingSubstitutionService bakingSubstitutionService;
    private final SubstitutionValidator substitutionValidator;

    public HealthifyResponse healthify(HealthifyRequest request) {
        HealthifyResponse response;

        if ("BAKING".equalsIgnoreCase(request.getMode())) {
            response = bakingSubstitutionService.substitute(request.getRecipe(), request.getSliderIntensity());
        } else {
            response = aiSubstitutionPort.substitute(request.getRecipe(), request.getSliderIntensity());
            substitutionValidator.validate(response);
        }

        return response;
    }
}
