package com.healthify.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.healthify.dto.HealthifyResponse;
import com.healthify.dto.SaveRecipeRequest;
import com.healthify.model.Recipe;
import com.healthify.model.SavedRecipe;
import com.healthify.model.User;
import com.healthify.repository.RecipeRepository;
import com.healthify.repository.SavedRecipeRepository;
import com.healthify.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class RecipeService {

    private final SavedRecipeRepository savedRecipeRepository;
    private final RecipeRepository recipeRepository;
    private final UserRepository userRepository;
    private final ObjectMapper objectMapper;

    public SavedRecipe save(SaveRecipeRequest request, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        Recipe recipe = recipeRepository.findByIdAndUserId(request.getRecipeId(), user.getId())
                .orElseThrow(() -> new IllegalArgumentException("Recipe not found or does not belong to user"));

        HealthifyResponse hr = request.getHealthifyResponse();

        String substitutedJson;
        try {
            substitutedJson = objectMapper.writeValueAsString(hr.getSubstitutedIngredients());
        } catch (JsonProcessingException e) {
            throw new RuntimeException("Failed to serialize substituted ingredients", e);
        }

        String rewrittenText = String.join("\n", hr.getRewrittenInstructions());

        SavedRecipe savedRecipe = SavedRecipe.builder()
                .user(user)
                .recipe(recipe)
                .substitutedIngredients(substitutedJson)
                .rewrittenInstructions(rewrittenText)
                .sliderIntensity(request.getSliderIntensity())
                .mode(request.getMode())
                .build();

        return savedRecipeRepository.save(savedRecipe);
    }

    public List<SavedRecipe> getSavedRecipes(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
        return savedRecipeRepository.findByUserId(user.getId());
    }
}
