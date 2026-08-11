package com.backend.bailreckoner;

import com.backend.bailreckoner.dto.ChatMessageRequest;
import com.backend.bailreckoner.dto.ChatResponse;
import com.backend.bailreckoner.entity.ChatMessage;
import com.backend.bailreckoner.entity.ChatSession;
import com.backend.bailreckoner.entity.LawSection;
import com.backend.bailreckoner.entity.User;
import com.backend.bailreckoner.enums.Role;
import com.backend.bailreckoner.repository.ChatMessageRepository;
import com.backend.bailreckoner.repository.ChatSessionRepository;
import com.backend.bailreckoner.repository.LawSectionRepository;
import com.backend.bailreckoner.service.AuditService;
import com.backend.bailreckoner.service.ChatService;
import com.backend.bailreckoner.service.LLMService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ChatServiceTest {

    @Mock
    private ChatSessionRepository chatSessionRepository;

    @Mock
    private ChatMessageRepository chatMessageRepository;

    @Mock
    private LawSectionRepository lawSectionRepository;

    @Mock
    private LLMService llmService;

    @Mock
    private AuditService auditService;

    @InjectMocks
    private ChatService chatService;

    private User sampleUser;
    private ChatSession sampleSession;
    private LawSection sampleLaw;

    @BeforeEach
    void setUp() {
        sampleUser = User.builder()
                .id(UUID.randomUUID())
                .name("Lawyer Chat")
                .email("chat@test.com")
                .role(Role.LAWYER)
                .build();

        sampleSession = ChatSession.builder()
                .id(UUID.randomUUID())
                .user(sampleUser)
                .build();

        sampleLaw = LawSection.builder()
                .id(UUID.randomUUID())
                .lawName("Indian Penal Code")
                .sectionNumber("379")
                .title("Theft")
                .description("Punishment for theft")
                .bailable(true)
                .active(true)
                .build();
    }

    @Test
    @DisplayName("Process Message - Blocking Direct Eligibility Queries")
    void testProcessMessageEligibilityQueryBlocked() {
        ChatMessageRequest req = new ChatMessageRequest();
        req.setMessage("Am I eligible for bail?");
        req.setSessionId(sampleSession.getId());

        when(chatSessionRepository.findById(sampleSession.getId())).thenReturn(Optional.of(sampleSession));

        ChatResponse response = chatService.processMessage(req, sampleUser);

        assertNotNull(response);
        assertTrue(response.getReply().contains("I cannot determine or calculate official bail eligibility"));
        verify(llmService, never()).generateResponse(any());
        verify(chatMessageRepository, times(2)).save(any(ChatMessage.class));
    }

    @Test
    @DisplayName("Process Message - Standard Legal Q&A using RAG Context")
    void testProcessMessageLegalQaWithRAG() {
        ChatMessageRequest req = new ChatMessageRequest();
        req.setMessage("Explain section 379 IPC theft penalty");
        req.setSessionId(sampleSession.getId());

        when(chatSessionRepository.findById(sampleSession.getId())).thenReturn(Optional.of(sampleSession));
        when(lawSectionRepository.searchLaws("Explain section 379 IPC theft penalty")).thenReturn(List.of(sampleLaw));
        when(llmService.generateResponse(any())).thenReturn("Section 379 IPC prescribes punishment for theft.");

        ChatResponse response = chatService.processMessage(req, sampleUser);

        assertNotNull(response);
        assertEquals("Section 379 IPC prescribes punishment for theft.", response.getReply());
        assertFalse(response.getCitations().isEmpty());
        assertEquals("Section 379", response.getCitations().get(0).getSection());
    }

    @Test
    @DisplayName("Process Message - Fallback when LLM Service is Offline")
    void testProcessMessageOfflineFallback() {
        ChatMessageRequest req = new ChatMessageRequest();
        req.setMessage("Details on bailable theft section");

        when(chatSessionRepository.save(any())).thenReturn(sampleSession);
        when(lawSectionRepository.searchLaws("Details on bailable theft section")).thenReturn(List.of(sampleLaw));
        when(llmService.generateResponse(any())).thenReturn(null); // Simulated offline LLM

        ChatResponse response = chatService.processMessage(req, sampleUser);

        assertNotNull(response);
        assertTrue(response.getReply().contains("Statutory Context retrieved from repository:"));
        assertTrue(response.getReply().contains("379"));
    }
}
