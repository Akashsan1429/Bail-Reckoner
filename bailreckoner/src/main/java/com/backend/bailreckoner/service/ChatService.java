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

        // Check for eligibility calculation request - Chatbot provides guidance and option redirect
        if (lowerMsg.contains("am i eligible") || lowerMsg.contains("will i get bail") ||
            lowerMsg.contains("can i get bail") || lowerMsg.contains("eligible for bail") ||
            lowerMsg.contains("calculate my bail")) {
            
            String reply = "I cannot determine or calculate official bail eligibility directly in chat.\n\n" +
                           "Please use the formal **Eligibility Checker module** in the application, which runs our authoritative deterministic rule engine according to statutory formulas (Sec 436A CrPC / Sec 479 BNSS).\n\n" +
                           "Click the button below to launch a formal assessment for your case.";
            
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
        promptBuilder.append("You are an AI legal assistant for the Bail Reckoner application.\n");
        promptBuilder.append("1. Answer directly using verified Indian statutory law (IPC, BNS, CrPC, BNSS).\n");
        promptBuilder.append("2. Explain section numbers, bailability status, maximum sentence, and statutory rights clearly.\n");
        promptBuilder.append("3. Provide concise, well-structured legal guidance.\n\n");
        promptBuilder.append("VERIFIED LEGAL CONTEXT:\n");

        for (LawSection law : relevantLaws) {
            promptBuilder.append(String.format("- Law: %s, Section: %s, Title: %s, Description: %s, Summary: %s, Bailable: %b, Max Sentence: %d years\n",
                    law.getLawName(), law.getSectionNumber(), law.getTitle(), law.getDescription(),
                    law.getPlainLanguageSummary(), law.getBailable(), law.getMaximumSentenceYears()));
        }

        promptBuilder.append("\nUSER QUESTION: ").append(message).append("\n");

        String reply = llmService.generateResponse(promptBuilder.toString());

        if (reply == null || reply.isBlank()) {
            // Smart statutory intelligence response engine when Gemini API key is offline
            reply = generateStructuredLegalResponse(message, relevantLaws);
        }

        saveAssistantMessage(session, reply);
        auditService.logAction(currentUser.getId(), AuditAction.CHAT_MESSAGE, "CHAT_SESSION", session.getId());

        return ChatResponse.builder()
                .sessionId(session.getId())
                .reply(reply)
                .citations(citations)
                .build();
    }

    private String generateStructuredLegalResponse(String userMsg, List<LawSection> laws) {
        String lower = userMsg.toLowerCase();
        StringBuilder sb = new StringBuilder();

        // 1. Procedural or general questions
        if (lower.contains("document") || lower.contains("surety") || lower.contains("bond") || lower.contains("procedure")) {
            sb.append("📋 **Statutory Bail Documentation & Procedure Guidance:**\n\n");
            sb.append("To apply for bail in an Indian court, undertrial prisoners and legal representatives typically require:\n");
            sb.append("1. **Bail Application Draft**: Formal petition under Sec. 436/437/439 CrPC (or Sec. 478/479/483 BNSS).\n");
            sb.append("2. **Personal Identification Proof**: Aadhaar Card, Voter ID, or Ration Card of the undertrial.\n");
            sb.append("3. **Surety Verification Documents**: Revenue/Property records, Solvency Certificate, or Identity proof of local surety.\n");
            sb.append("4. **FIR & Charge-sheet Copies**: Certified copy of the FIR from the concerned Police Station.\n\n");
            sb.append("💡 *Tip: For bailable offences, bail is a statutory right upon presenting solvent sureties or personal bond.*");
            return sb.toString();
        }

        if (lower.contains("436a") || lower.contains("479") || lower.contains("undertrial") || lower.contains("half") || lower.contains("duration")) {
            sb.append("⚖️ **Undertrial Custody Limits (CrPC 436A / BNSS 479):**\n\n");
            sb.append("Under Section 436A of CrPC and Section 479 of the Bharatiya Nagarik Suraksha Sanhita (BNSS):\n");
            sb.append("• **First-time Offenders**: Eligible for mandatory release on personal bond after serving **1/3rd** of the maximum prescribed imprisonment.\n");
            sb.append("• **Other Undertrials**: Eligible for mandatory release after serving **1/2 (50%)** of the maximum imprisonment.\n");
            sb.append("• **Exception**: Does not apply to offences punishable with death penalty.\n");
            return sb.toString();
        }

        // 2. Specific Law/Section matched response
        if (!laws.isEmpty()) {
            LawSection bestMatch = laws.get(0);
            sb.append(String.format("⚖️ **Statutory Analysis: %s Section %s** (%s)\n\n", 
                    bestMatch.getLawName(), bestMatch.getSectionNumber(), bestMatch.getTitle()));
            
            sb.append(String.format("• **Statutory Bailability**: %s\n", 
                    Boolean.TRUE.equals(bestMatch.getBailable()) ? "✅ **BAILABLE** (Bail is a matter of statutory right)" : "⚠️ **NON-BAILABLE** (Bail is subject to judicial discretion)"));
            
            sb.append(String.format("• **Maximum Sentence**: %d Years Imprisonment\n", bestMatch.getMaximumSentenceYears()));
            
            if (bestMatch.getBnsEquivalent() != null || bestMatch.getIpcEquivalent() != null) {
                sb.append(String.format("• **Cross-References**: %s | %s | %s\n", 
                        bestMatch.getIpcEquivalent() != null ? bestMatch.getIpcEquivalent() : "",
                        bestMatch.getBnsEquivalent() != null ? bestMatch.getBnsEquivalent() : "",
                        bestMatch.getBnssEquivalent() != null ? bestMatch.getBnssEquivalent() : ""));
            }

            sb.append(String.format("\n📌 **Statutory Summary**:\n%s\n", 
                    bestMatch.getPlainLanguageSummary() != null ? bestMatch.getPlainLanguageSummary() : bestMatch.getDescription()));

            if (laws.size() > 1) {
                sb.append("\n📚 **Other Related Sections Found**:\n");
                for (int i = 1; i < Math.min(laws.size(), 4); i++) {
                    LawSection l = laws.get(i);
                    sb.append(String.format("• **%s Sec %s**: %s (%s, Max %d yrs)\n",
                            l.getLawName(), l.getSectionNumber(), l.getTitle(),
                            Boolean.TRUE.equals(l.getBailable()) ? "Bailable" : "Non-Bailable",
                            l.getMaximumSentenceYears()));
                }
            }
            return sb.toString();
        }

        // 3. General Legal Fallback
        sb.append("🏛️ **Bail Reckoner Legal Assistant Information:**\n\n");
        sb.append("I am trained on Indian Penal Code (IPC), Bharatiya Nyaya Sanhita (BNS), CrPC, and BNSS statutory provisions.\n\n");
        sb.append("You can ask me questions like:\n");
        sb.append("• *Is Section 379 IPC bailable?*\n");
        sb.append("• *What is BNS 318 (IPC 420)?*\n");
        sb.append("• *What are undertrial custody limits under CrPC 436A?*\n");
        sb.append("• *What documents are needed for bail surety?*");
        return sb.toString();
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
