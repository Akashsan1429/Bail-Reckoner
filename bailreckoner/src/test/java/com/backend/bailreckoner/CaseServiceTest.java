package com.backend.bailreckoner;

import com.backend.bailreckoner.dto.CaseDto;
import com.backend.bailreckoner.dto.CreateCaseRequest;
import com.backend.bailreckoner.dto.UpdateCaseRequest;
import com.backend.bailreckoner.entity.CaseEntity;
import com.backend.bailreckoner.entity.User;
import com.backend.bailreckoner.enums.CaseStatus;
import com.backend.bailreckoner.enums.Role;
import com.backend.bailreckoner.repository.CaseRepository;
import com.backend.bailreckoner.service.AuditService;
import com.backend.bailreckoner.service.CaseService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CaseServiceTest {

    @Mock
    private CaseRepository caseRepository;

    @Mock
    private AuditService auditService;

    @InjectMocks
    private CaseService caseService;

    private User sampleUser;
    private User otherUser;
    private CaseEntity sampleCase;

    @BeforeEach
    void setUp() {
        sampleUser = User.builder()
                .id(UUID.randomUUID())
                .name("Lawyer One")
                .email("lawyer1@test.com")
                .role(Role.LAWYER)
                .build();

        otherUser = User.builder()
                .id(UUID.randomUUID())
                .name("Lawyer Two")
                .email("lawyer2@test.com")
                .role(Role.LAWYER)
                .build();

        sampleCase = CaseEntity.builder()
                .id(UUID.randomUUID())
                .caseNumber("CASE-2026-999")
                .firNumber("FIR-999/2026")
                .policeStation("Station A")
                .offenceSection("379")
                .offenceType("Theft")
                .maximumSentenceYears(3)
                .custodyStartDate(LocalDate.now().minusMonths(6))
                .status(CaseStatus.DRAFT)
                .createdBy(sampleUser)
                .build();
    }

    @Test
    @DisplayName("Create Case - Success")
    void testCreateCaseSuccess() {
        CreateCaseRequest req = new CreateCaseRequest();
        req.setCaseNumber("CASE-2026-999");
        req.setFirNumber("FIR-999/2026");
        req.setPoliceStation("Station A");
        req.setOffenceSection("379");
        req.setOffenceType("Theft");
        req.setMaximumSentenceYears(3);

        when(caseRepository.existsByCaseNumber("CASE-2026-999")).thenReturn(false);
        when(caseRepository.save(any(CaseEntity.class))).thenReturn(sampleCase);

        CaseDto dto = caseService.createCase(req, sampleUser);

        assertNotNull(dto);
        assertEquals("CASE-2026-999", dto.getCaseNumber());
        assertEquals("379", dto.getOffenceSection());
        verify(auditService, times(1)).logAction(any(), any(), any(), any());
    }

    @Test
    @DisplayName("Create Case - Duplicate Case Number Exception")
    void testCreateCaseDuplicateNumber() {
        CreateCaseRequest req = new CreateCaseRequest();
        req.setCaseNumber("CASE-2026-999");
        req.setOffenceSection("379");

        when(caseRepository.existsByCaseNumber("CASE-2026-999")).thenReturn(true);

        assertThrows(IllegalArgumentException.class, () -> caseService.createCase(req, sampleUser));
    }

    @Test
    @DisplayName("Get Cases For User - Lawyer sees own cases")
    void testGetCasesForUser() {
        when(caseRepository.findByCreatedById(sampleUser.getId())).thenReturn(List.of(sampleCase));

        List<CaseDto> result = caseService.getCasesForUser(sampleUser);

        assertEquals(1, result.size());
        assertEquals("CASE-2026-999", result.get(0).getCaseNumber());
    }

    @Test
    @DisplayName("Get Case By Id - Ownership Security Check Passed")
    void testGetCaseByIdSuccess() {
        when(caseRepository.findById(sampleCase.getId())).thenReturn(Optional.of(sampleCase));

        CaseDto dto = caseService.getCaseById(sampleCase.getId(), sampleUser);

        assertNotNull(dto);
        assertEquals(sampleCase.getId(), dto.getId());
    }

    @Test
    @DisplayName("Get Case By Id - Access Denied for Unassociated Lawyer")
    void testGetCaseByIdAccessDenied() {
        when(caseRepository.findById(sampleCase.getId())).thenReturn(Optional.of(sampleCase));

        assertThrows(SecurityException.class, () -> caseService.getCaseById(sampleCase.getId(), otherUser));
    }

    @Test
    @DisplayName("Update Case - Success")
    void testUpdateCaseSuccess() {
        UpdateCaseRequest req = new UpdateCaseRequest();
        req.setPoliceStation("New Station B");
        req.setCaseStage("CHARGE_SHEET_FILED");

        when(caseRepository.findById(sampleCase.getId())).thenReturn(Optional.of(sampleCase));
        when(caseRepository.save(any(CaseEntity.class))).thenAnswer(i -> i.getArgument(0));

        CaseDto updated = caseService.updateCase(sampleCase.getId(), req, sampleUser);

        assertEquals("New Station B", updated.getPoliceStation());
        assertEquals("CHARGE_SHEET_FILED", updated.getCaseStage());
    }
}
