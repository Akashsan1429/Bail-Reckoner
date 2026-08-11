package com.backend.bailreckoner.service;

import com.backend.bailreckoner.dto.ChatMessageRequest;
import com.backend.bailreckoner.dto.ChatResponse;
import com.backend.bailreckoner.dto.CitationDto;
import com.backend.bailreckoner.entity.ChatMessage;
import com.backend.bailreckoner.entity.ChatSession;
import com.backend.bailreckoner.entity.LawSection;
import com.backend.bailreckoner.entity.User;
import com.backend.bailreckoner.enums.AuditAction;
import com.backend.bailreckoner.enums.ChatRole;
import com.backend.bailreckoner.repository.ChatMessageRepository;
import com.backend.bailreckoner.repository.ChatSessionRepository;
import com.backend.bailreckoner.repository.LawSectionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ChatService {

    private final ChatSessionRepository chatSessionRepository;
    private final ChatMessageRepository chatMessageRepository;
    private final LawSectionRepository lawSectionRepository;
    private final LLMService llmService;
    private final AuditService auditService;

    @Transactional
    public ChatResponse processMessage(ChatMessageRequest request, User currentUser) {
        String message = request.getMessage().trim();
        String lowerMsg = message.toLowerCase();

        // Ensure session
        ChatSession session;
        if (request.getSessionId() != null) {
            session = chatSessionRepository.findById(request.getSessionId())
                    .orElseGet(() -> createNewSession(currentUser, request.getCaseId()));
        } else {
            session = createNewSession(currentUser, request.getCaseId());
        }

        // Save User Message
        ChatMessage userMsg = ChatMessage.builder()
                .session(session)
                .role(ChatRole.USER)
                .message(message)
                .build();
        chatMessageRepository.save(userMsg);

        // Check for eligibility queries - Chatbot must NOT calculate eligibility
        if (lowerMsg.contains("am i eligible") || lowerMsg.contains("will i get bail") ||
            lowerMsg.contains("can i get bail") || lowerMsg.contains("eligible for bail")) {
            
            String reply = "I cannot determine or calculate official bail eligibility. " +
                           "Please use the formal Eligibility Checker module in the application, which runs the authoritative deterministic rule engine. " +
                           "I can provide legal explanations, statutory context, and section information based on verified laws.";
            
            saveAssistantMessage(session, reply);
            auditService.logAction(currentUser.getId(), AuditAction.CHAT_MESSAGE, "CHAT_SESSION", session.getId());

            return ChatResponse.builder()
                    .sessionId(session.getId())
                    .reply(reply)
                    .citations(new ArrayList<>())
                    .build();
        }

        // Search MySQL RAG for relevant legal context
        List<LawSection> relevantLaws = lawSectionRepository.searchLaws(message);
        if (relevantLaws.isEmpty()) {
            relevantLaws = lawSectionRepository.findByActiveTrue();
        }

        List<CitationDto> citations = relevantLaws.stream()
                .map(law -> CitationDto.builder()
                        .law(law.getLawName())
                        .section("Section " + law.getSectionNumber())
                        .source(law.getSource() != null ? law.getSource() : "Statutory Repository")
                        .build())
                .collect(Collectors.toList());

        // Construct RAG Prompt for Gemini
        StringBuilder promptBuilder = new StringBuilder();
        promptBuilder.append("SYSTEM INSTRUCTION:\n");
        promptBuilder.append("You are an legal assistant for the Bail Reckoner application.\n");
        promptBuilder.append("1. Answer only using the supplied verified legal context where possible.\n");
        promptBuilder.append("2. Do NOT invent laws, sections, or citations.\n");
        promptBuilder.append("3. Do NOT determine official bail eligibility or guarantee legal outcomes.\n");
        promptBuilder.append("4. Explain when information is insufficient.\n");
        promptBuilder.append("5. Provide source citations.\n\n");
        promptBuilder.append("VERIFIED LEGAL CONTEXT FROM MYSQL REPOSITORY:\n");

        for (LawSection law : relevantLaws) {
            promptBuilder.append(String.format("- Law: %s, Section: %s, Title: %s, Description: %s, Summary: %s, Bailable: %b\n",
                    law.getLawName(), law.getSectionNumber(), law.getTitle(), law.getDescription(),
                    law.getPlainLanguageSummary(), law.getBailable()));
        }

        promptBuilder.append("\nUSER QUESTION: ").append(message).append("\n");

        String reply = llmService.generateResponse(promptBuilder.toString());

        if (reply == null || reply.isBlank()) {
            // Grounded fallback response when Gemini API key is offline
            StringBuilder fallback = new StringBuilder();
            fallback.append("Statutory Context retrieved from repository:\n");
            for (LawSection law : relevantLaws) {
                fallback.append(String.format("• %s Section %s (%s): %s. Classification: %s.\n",
                        law.getLawName(), law.getSectionNumber(), law.getTitle(),
                        law.getPlainLanguageSummary() != null ? law.getPlainLanguageSummary() : law.getDescription(),
                        Boolean.TRUE.equals(law.getBailable()) ? "Bailable" : "Non-Bailable"));
            }
            reply = fallback.toString();
        }

        saveAssistantMessage(session, reply);
        auditService.logAction(currentUser.getId(), AuditAction.CHAT_MESSAGE, "CHAT_SESSION", session.getId());

        return ChatResponse.builder()
                .sessionId(session.getId())
                .reply(reply)
                .citations(citations)
                .build();
    }

    private ChatSession createNewSession(User user, UUID caseId) {
        ChatSession session = ChatSession.builder()
                .user(user)
                .caseId(caseId)
                .build();
        return chatSessionRepository.save(session);
    }

    private void saveAssistantMessage(ChatSession session, String reply) {
        ChatMessage assistantMsg = ChatMessage.builder()
                .session(session)
                .role(ChatRole.ASSISTANT)
                .message(reply)
                .build();
        chatMessageRepository.save(assistantMsg);
    }
}
