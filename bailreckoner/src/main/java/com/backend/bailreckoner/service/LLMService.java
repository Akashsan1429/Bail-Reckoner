package com.backend.bailreckoner.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.ai.chat.model.ChatModel;
import org.springframework.ai.chat.prompt.Prompt;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Slf4j
@Service
public class LLMService {

    private final ObjectProvider<ChatModel> chatModelProvider;

    @Value("${spring.ai.google.genai.api-key:}")
    private String apiKey;

    public LLMService(ObjectProvider<ChatModel> chatModelProvider) {
        this.chatModelProvider = chatModelProvider;
    }

    public String generateResponse(String promptText) {
        if (apiKey == null || apiKey.isBlank() || apiKey.contains("dummy") || apiKey.contains("your_gemini_api_key")) {
            log.warn("Gemini API key is not configured or is placeholder. Operating in grounded offline mode.");
            return null;
        }

        try {
            ChatModel chatModel = chatModelProvider.getIfAvailable();
            if (chatModel != null) {
                return chatModel.call(new Prompt(promptText)).getResult().getOutput().getText();
            }
        } catch (Exception e) {
            log.error("Failed to invoke Gemini model API: {}", e.getMessage());
        }

        return null;
    }
}
