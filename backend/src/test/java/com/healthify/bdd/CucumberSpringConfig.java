package com.healthify.bdd;

import com.healthify.service.BakingSubstitutionService;
import com.healthify.service.SubstitutionValidator;
import io.cucumber.spring.CucumberContextConfiguration;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;

@CucumberContextConfiguration
@SpringBootTest(classes = {BakingSubstitutionService.class, SubstitutionValidator.class})
@Import({BakingSubstitutionService.class, SubstitutionValidator.class})
public class CucumberSpringConfig {
}
