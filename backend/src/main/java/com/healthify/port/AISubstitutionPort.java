package com.healthify.port;

import com.healthify.dto.HealthifyResponse;
import com.healthify.dto.ParsedRecipe;

public interface AISubstitutionPort {
    HealthifyResponse substitute(ParsedRecipe recipe, int sliderIntensity);
}
