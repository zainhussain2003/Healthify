package com.healthify.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.healthify.dto.*;
import com.healthify.port.AISubstitutionPort;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Slf4j
public class OpenAISubstitutionAdapter implements AISubstitutionPort {

    private final String apiKey;
    private final String model;
    private final ObjectMapper objectMapper;
    private final HttpClient httpClient;
    private final String systemPrompt;

    public OpenAISubstitutionAdapter(
            @Value("${ai.api-key}") String apiKey,
            @Value("${ai.model}") String model,
            ObjectMapper objectMapper) {
        this.apiKey = apiKey;
        this.model = model;
        this.objectMapper = objectMapper;
        this.httpClient = HttpClient.newHttpClient();
        this.systemPrompt = loadPrompt();
    }

    @Override
    public HealthifyResponse substitute(ParsedRecipe recipe, int sliderIntensity) {
        if (apiKey == null || apiKey.isBlank() || apiKey.startsWith("sk-...")) {
            log.warn("AI API key not configured — returning mock substitution response");
            return buildMockResponse(recipe);
        }

        try {
            String userMessage = buildUserMessage(recipe, sliderIntensity);
            String requestBody = buildRequestBody(userMessage);

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create("https://api.openai.com/v1/chat/completions"))
                    .header("Content-Type", "application/json")
                    .header("Authorization", "Bearer " + apiKey)
                    .POST(HttpRequest.BodyPublishers.ofString(requestBody))
                    .build();

            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());

            if (response.statusCode() != 200) {
                log.error("OpenAI API error: status={} body={}", response.statusCode(), response.body());
                throw new RuntimeException("AI service unavailable");
            }

            return parseAIResponse(response.body(), recipe);

        } catch (RuntimeException e) {
            throw e;
        } catch (Exception e) {
            log.error("Failed to call OpenAI API", e);
            throw new RuntimeException("AI service unavailable");
        }
    }

    private String buildUserMessage(ParsedRecipe recipe, int sliderIntensity) {
        String ingredientsList = recipe.getIngredients().stream()
                .map(i -> String.format("- %s %s %s", i.getAmount(), i.getUnit(), i.getName()))
                .collect(Collectors.joining("\n"));

        String instructionsList = recipe.getInstructions().stream()
                .map(step -> "- " + step)
                .collect(Collectors.joining("\n"));

        return String.format("""
                Recipe: %s
                Intensity level: %d/5

                INGREDIENTS:
                %s

                INSTRUCTIONS:
                %s
                """,
                recipe.getTitle(), sliderIntensity, ingredientsList, instructionsList);
    }

    private String buildRequestBody(String userMessage) throws Exception {
        var messages = List.of(
                objectMapper.createObjectNode().put("role", "system").put("content", systemPrompt),
                objectMapper.createObjectNode().put("role", "user").put("content", userMessage)
        );

        var body = objectMapper.createObjectNode();
        body.put("model", model);
        body.put("temperature", 0.3);
        body.set("messages", objectMapper.valueToTree(messages));

        return objectMapper.writeValueAsString(body);
    }

    private HealthifyResponse parseAIResponse(String responseBody, ParsedRecipe recipe) throws Exception {
        JsonNode root = objectMapper.readTree(responseBody);
        String content = root.path("choices").get(0).path("message").path("content").asText();

        JsonNode result = objectMapper.readTree(content);

        List<SubstitutedIngredient> substituted = new ArrayList<>();
        for (JsonNode node : result.path("substitutedIngredients")) {
            substituted.add(SubstitutedIngredient.builder()
                    .original(Ingredient.builder()
                            .name(node.path("original").path("name").asText())
                            .amount(node.path("original").path("amount").asText())
                            .unit(node.path("original").path("unit").asText())
                            .build())
                    .substitute(Ingredient.builder()
                            .name(node.path("substitute").path("name").asText())
                            .amount(node.path("substitute").path("amount").asText())
                            .unit(node.path("substitute").path("unit").asText())
                            .build())
                    .why(node.path("why").asText())
                    .build());
        }

        List<String> rewritten = new ArrayList<>();
        result.path("rewrittenInstructions").forEach(n -> rewritten.add(n.asText()));

        List<String> safety = new ArrayList<>();
        result.path("safetyNotes").forEach(n -> safety.add(n.asText()));

        return HealthifyResponse.builder()
                .title(recipe.getTitle())
                .substitutedIngredients(substituted)
                .originalInstructions(recipe.getInstructions())
                .rewrittenInstructions(rewritten)
                .safetyNotes(safety)
                .mode("COOKING")
                .build();
    }

    private HealthifyResponse buildMockResponse(ParsedRecipe recipe) {
        List<SubstitutedIngredient> mocked = recipe.getIngredients().stream()
                .limit(1)
                .map(ing -> SubstitutedIngredient.builder()
                        .original(ing)
                        .substitute(Ingredient.builder()
                                .name(ing.getName() + " (healthier alternative)")
                                .amount(ing.getAmount())
                                .unit(ing.getUnit())
                                .build())
                        .why("Mock substitution — add your AI API key to get real suggestions.")
                        .build())
                .collect(Collectors.toList());

        return HealthifyResponse.builder()
                .title(recipe.getTitle())
                .substitutedIngredients(mocked)
                .originalInstructions(recipe.getInstructions())
                .rewrittenInstructions(recipe.getInstructions())
                .safetyNotes(List.of("Configure ai.api-key in application.properties for real substitutions."))
                .mode("COOKING")
                .build();
    }

    private String loadPrompt() {
        try {
            return new ClassPathResource("prompts/v1-cooking-mode.txt")
                    .getContentAsString(StandardCharsets.UTF_8);
        } catch (Exception e) {
            log.error("Failed to load AI prompt file", e);
            return "You are a healthy recipe substitution assistant. Respond with valid JSON only.";
        }
    }
}
