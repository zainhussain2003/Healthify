package com.healthify.controller;

import com.healthify.dto.*;
import com.healthify.model.SavedRecipe;
import com.healthify.service.RecipeParseService;
import com.healthify.service.RecipeService;
import com.healthify.service.SubstitutionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/recipes")
@RequiredArgsConstructor
public class RecipeController {

    private final RecipeParseService recipeParseService;
    private final SubstitutionService substitutionService;
    private final RecipeService recipeService;

    @PostMapping("/parse")
    public ResponseEntity<ParsedRecipe> parse(
            @Valid @RequestBody RecipeParseRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        ParsedRecipe parsed = recipeParseService.parse(request.getTitle(), request.getText(), userDetails.getUsername());
        return ResponseEntity.ok(parsed);
    }

    @PostMapping("/healthify")
    public ResponseEntity<HealthifyResponse> healthify(
            @Valid @RequestBody HealthifyRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        HealthifyResponse response = substitutionService.healthify(request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/saved")
    public ResponseEntity<Void> saveRecipe(
            @Valid @RequestBody SaveRecipeRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        recipeService.save(request, userDetails.getUsername());
        return ResponseEntity.ok().build();
    }

    @GetMapping("/saved")
    public ResponseEntity<List<SavedRecipe>> getSavedRecipes(
            @AuthenticationPrincipal UserDetails userDetails) {
        List<SavedRecipe> saved = recipeService.getSavedRecipes(userDetails.getUsername());
        return ResponseEntity.ok(saved);
    }
}
