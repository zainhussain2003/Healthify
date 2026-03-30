package com.healthify.port;

import com.healthify.dto.ParsedRecipe;

public interface RecipeScraperPort {
    ParsedRecipe scrape(String url);
}
