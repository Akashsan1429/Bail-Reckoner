package com.backend.bailreckoner;

import com.backend.bailreckoner.dto.*;
import com.backend.bailreckoner.enums.Role;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import java.time.LocalDate;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class ControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    @DisplayName("Full End-to-End Flow: Register -> Login -> Case CRUD -> Evaluation -> Chat -> PDF")
    void testFullEndToEndBailReckonerFlow() throws Exception {
        // 1. REGISTER
        String email = "flow.lawyer." + UUID.randomUUID().toString().substring(0, 6) + "@test.com";
        RegisterRequest registerReq = new RegisterRequest();
        registerReq.setName("Flow Lawyer");
        registerReq.setEmail(email);
        registerReq.setPassword("Password123!");
        registerReq.setRole(Role.LAWYER);

        MvcResult regResult = mockMvc.perform(post("/api/v1/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(registerReq)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").exists())
                .andReturn();

        AuthResponse regAuth = objectMapper.readValue(regResult.getResponse().getContentAsString(), AuthResponse.class);
        assertNotNull(regAuth.getToken());

        // 2. LOGIN
        LoginRequest loginReq = new LoginRequest();
        loginReq.setEmail(email);
        loginReq.setPassword("Password123!");

        MvcResult loginResult = mockMvc.perform(post("/api/v1/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginReq)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").exists())
                .andReturn();

        AuthResponse loginAuth = objectMapper.readValue(loginResult.getResponse().getContentAsString(), AuthResponse.class);
        String token = loginAuth.getToken();
        String authHeader = "Bearer " + token;

        // 3. GET /me
        mockMvc.perform(get("/api/v1/auth/me")
                        .header("Authorization", authHeader))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.email").value(email));

        // 4. CREATE CASE
        String caseNum = "CASE-FLOW-" + UUID.randomUUID().toString().substring(0, 8);
        CreateCaseRequest caseReq = new CreateCaseRequest();
        caseReq.setCaseNumber(caseNum);
        caseReq.setFirNumber("FIR-101/2026");
        caseReq.setPoliceStation("North Station");
        caseReq.setOffenceSection("379");
        caseReq.setOffenceType("Theft");
        caseReq.setMaximumSentenceYears(3);
        caseReq.setCustodyStartDate(LocalDate.now().minusMonths(4));
        caseReq.setFirstTimeOffender(true);

        MvcResult caseResult = mockMvc.perform(post("/api/v1/cases")
                        .header("Authorization", authHeader)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(caseReq)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.caseNumber").value(caseNum))
                .andReturn();

        CaseDto createdCase = objectMapper.readValue(caseResult.getResponse().getContentAsString(), CaseDto.class);
        UUID caseId = createdCase.getId();

        // 5. GET CASE DETAILS
        mockMvc.perform(get("/api/v1/cases/" + caseId)
                        .header("Authorization", authHeader))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(caseId.toString()));

        // 6. EVALUATE CASE
        MvcResult evalResult = mockMvc.perform(post("/api/v1/cases/" + caseId + "/evaluate")
                        .header("Authorization", authHeader))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.outcome").value("ELIGIBLE"))
                .andReturn();

        VerdictDto verdict = objectMapper.readValue(evalResult.getResponse().getContentAsString(), VerdictDto.class);
        assertNotNull(verdict.getOutcome());

        // 7. LAW SEARCH
        mockMvc.perform(get("/api/v1/laws/search?query=379"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].sectionNumber").value("379"));

        // 8. GEMINI / RAG CHAT
        ChatMessageRequest chatReq = new ChatMessageRequest();
        chatReq.setCaseId(caseId);
        chatReq.setMessage("What are the provisions under IPC 379 for theft?");

        mockMvc.perform(post("/api/v1/chat/message")
                        .header("Authorization", authHeader)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(chatReq)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.reply").exists());

        // 9. GENERATE PDF REPORT
        mockMvc.perform(post("/api/v1/cases/" + caseId + "/report")
                        .header("Authorization", authHeader))
                .andExpect(status().isOk())
                .andExpect(header().string("Content-Type", "application/pdf"));
    }
}
