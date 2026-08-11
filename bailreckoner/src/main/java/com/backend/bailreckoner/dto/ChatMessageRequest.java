package com.backend.bailreckoner.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.util.UUID;

@Data
public class ChatMessageRequest {
    private UUID sessionId;

    @NotBlank(message = "Message cannot be blank")
    private String message;

    private UUID caseId;
}
