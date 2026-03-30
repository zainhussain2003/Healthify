package com.healthify.unit;

import com.healthify.dto.Ingredient;
import com.healthify.dto.ParsedRecipe;
import com.healthify.model.Recipe;
import com.healthify.model.User;
import com.healthify.repository.RecipeRepository;
import com.healthify.repository.UserRepository;
import com.healthify.service.RecipeParseService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class RecipeParseServiceTest {

    @Mock
    private RecipeRepository recipeRepository;

    @Mock
    private UserRepository userRepository;

    private RecipeParseService service;

    private final User testUser = User.builder().id(1L).email("test@test.com").password("hashed").build();

    @BeforeEach
    void setUp() {
        service = new RecipeParseService(recipeRepository, userRepository);
        when(userRepository.findByEmail("test@test.com")).thenReturn(Optional.of(testUser));
        Recipe saved = Recipe.builder().id(1L).user(testUser).title("Test").originalText("").build();
        when(recipeRepository.save(any(Recipe.class))).thenReturn(saved);
    }

    @Test
    void extracts_ingredients_from_section_header() {
        String text = """
                My Chocolate Cake

                Ingredients:
                2 cups flour
                1 cup sugar

                Instructions:
                Mix together and bake at 350°F.
                """;

        ParsedRecipe result = service.parse(null, text, "test@test.com");

        assertThat(result.getIngredients()).hasSize(2);
        assertThat(result.getIngredients()).extracting(Ingredient::getName)
                .containsExactlyInAnyOrder("flour", "sugar");
    }

    @Test
    void extracts_instructions_from_section_header() {
        String text = """
                Chocolate Cake

                Ingredients:
                2 cups flour

                Instructions:
                Preheat the oven to 350°F.
                Mix the flour with eggs.
                Bake for 30 minutes.
                """;

        ParsedRecipe result = service.parse(null, text, "test@test.com");

        assertThat(result.getInstructions()).hasSize(3);
    }

    @Test
    void uses_provided_title_over_extracted_title() {
        String text = "Chocolate Cake\n\nIngredients:\n1 cup flour\n";
        ParsedRecipe result = service.parse("Custom Title", text, "test@test.com");
        assertThat(result.getTitle()).isEqualTo("Custom Title");
    }

    @Test
    void extracts_title_from_first_line_when_not_provided() {
        String text = "Banana Bread\n\nIngredients:\n2 bananas\n";
        ParsedRecipe result = service.parse(null, text, "test@test.com");
        assertThat(result.getTitle()).isEqualTo("Banana Bread");
    }

    @Test
    void fallback_parses_numbered_lines_as_ingredients_when_no_headers() {
        String text = "2 cups flour\n1 cup milk\n3 eggs";
        ParsedRecipe result = service.parse(null, text, "test@test.com");
        assertThat(result.getIngredients()).isNotEmpty();
    }

    @Test
    void strips_leading_bullets_from_ingredient_lines() {
        String text = """
                My Recipe

                Ingredients:
                • 2 cups flour
                - 1 cup sugar
                * 3 eggs

                Instructions:
                Mix everything.
                """;

        ParsedRecipe result = service.parse(null, text, "test@test.com");

        assertThat(result.getIngredients()).hasSize(3);
        assertThat(result.getIngredients()).extracting(Ingredient::getName)
                .containsExactlyInAnyOrder("flour", "sugar", "eggs");
    }

    @Test
    void strips_step_numbers_from_instructions() {
        String text = """
                Recipe

                Ingredients:
                1 cup flour

                Instructions:
                1. Mix the flour.
                Step 2: Bake at 350°F.
                3) Let it cool.
                """;

        ParsedRecipe result = service.parse(null, text, "test@test.com");

        assertThat(result.getInstructions()).hasSize(3);
        assertThat(result.getInstructions().get(0)).isEqualTo("Mix the flour.");
        assertThat(result.getInstructions().get(1)).isEqualTo("Bake at 350°F.");
    }

    @Test
    void recipe_id_is_set_from_saved_entity() {
        ParsedRecipe result = service.parse(null, "Title\nIngredients:\n1 cup flour\n", "test@test.com");
        assertThat(result.getRecipeId()).isEqualTo(1L);
    }
}
