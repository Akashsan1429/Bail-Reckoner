package com.backend.bailreckoner.controller;

import com.backend.bailreckoner.dto.ChatMessageRequest;
import com.backend.bailreckoner.dto.ChatResponse;
import com.backend.bailreckoner.entity.User;
import com.backend.bailreckoner.service.ChatService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/chat")
@RequiredArgsConstructor
public class ChatController {

    private final ChatService chatService;

    @PostMapping("/message")
    public ResponseEntity<ChatResponse> sendMessage(
            @Valid @RequestBody ChatMessageRequest request,
            @AuthenticationPrincipal User currentUser) {
        return ResponseEntity.ok(chatService.processMessage(request, currentUser));
    }
}
