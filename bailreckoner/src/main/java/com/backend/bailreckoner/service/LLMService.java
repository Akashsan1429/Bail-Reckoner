package com.backend.bailreckoner.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.ai.chat.model.ChatModel;
import org.springframework.ai.chat.prompt.Prompt;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Slf4j
@Service
public class LLMService {

    private final ObjectProvider<ChatModel> chatModelProvider;
    private final RestClient restClient;
    private final ObjectMapper objectMapper;

    @Value("${spring.ai.google.genai.api-key:${GEMINI_API_KEY:}}")
    private String apiKey;

    @Value("${spring.ai.google.genai.chat.options.model:${GEMINI_MODEL:gemini-flash-latest}}")
    private String modelName;

    public LLMService(ObjectProvider<ChatModel> chatModelProvider, ObjectMapper objectMapper) {
        this.chatModelProvider = chatModelProvider;
        this.objectMapper = objectMapper;
        this.restClient = RestClient.builder().build();
    }

    public String generateResponse(String promptText) {
        if (apiKey == null || apiKey.isBlank() || apiKey.contains("dummy") || apiKey.contains("your_gemini_api_key")) {
            log.warn("Gemini API key is not configured or is placeholder. LLM invocation skipped.");
            return null;
        }

        // 1. Try Spring AI ChatModel if available
        try {
            ChatModel chatModel = chatModelProvider.getIfAvailable();
            if (chatModel != null) {
                log.info("Invoking Gemini via Spring AI ChatModel using model: {}", modelName);
                String result = chatModel.call(new Prompt(promptText)).getResult().getOutput().getText();
                if (result != null && !result.isBlank()) {
                    return result;
                }
            }
        } catch (Exception e) {
            log.warn("Spring AI ChatModel invocation failed ({}), falling back to direct Gemini REST API call.", e.getMessage());
        }

        // 2. Direct REST API call to Google Gemini API (fallback for Spring AI starter variations)
        try {
            String activeModel = (modelName == null || modelName.isBlank() || modelName.contains("1.5-flash"))
                    ? "gemini-flash-latest" : modelName;

            log.info("Invoking Google Gemini REST API (Endpoint: /v1beta/models/{}:generateContent)", activeModel);

            String endpointUrl = "https://generativelanguage.googleapis.com/v1beta/models/" + activeModel + ":generateContent?key=" + apiKey;

            Map<String, Object> requestBody = new HashMap<>();
            Map<String, Object> part = new HashMap<>();
            part.put("text", promptText);

            Map<String, Object> content = new HashMap<>();
            content.put("parts", Collections.singletonList(part));

            requestBody.put("contents", Collections.singletonList(content));

            String jsonPayload = objectMapper.writeValueAsString(requestBody);

            String responseString = restClient.post()
                    .uri(endpointUrl)
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(jsonPayload)
                    .retrieve()
                    .body(String.class);

            if (responseString != null && !responseString.isBlank()) {
                JsonNode root = objectMapper.readTree(responseString);
                JsonNode candidates = root.path("candidates");
                if (candidates.isArray() && candidates.size() > 0) {
                    JsonNode textNode = candidates.get(0).path("content").path("parts").get(0).path("text");
                    if (!textNode.isMissingNode()) {
                        String generatedText = textNode.asText();
                        log.info("Successfully received and parsed response from Google Gemini LLM API ({} chars).", generatedText.length());
                        return generatedText;
                    }
                }
            }
        } catch (Exception e) {
            log.error("Failed to invoke Google Gemini LLM API: {}", e.getMessage());
        }

        return null;
    }
}
