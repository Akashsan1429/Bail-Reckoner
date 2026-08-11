package com.backend.bailreckoner;

import com.backend.bailreckoner.dto.CaseDto;
import com.backend.bailreckoner.dto.VerdictDto;
import com.backend.bailreckoner.entity.User;
import com.backend.bailreckoner.enums.CaseStatus;
import com.backend.bailreckoner.enums.Role;
import com.backend.bailreckoner.service.AuditService;
import com.backend.bailreckoner.service.CaseService;
import com.backend.bailreckoner.service.EligibilityService;
import com.backend.bailreckoner.service.PdfReportService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.Instant;
import java.util.Collections;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class PdfReportServiceTest {

    @Mock
    private CaseService caseService;

    @Mock
    private EligibilityService eligibilityService;

    @Mock
    private AuditService auditService;

    @InjectMocks
    private PdfReportService pdfReportService;

    private User sampleUser;
    private CaseDto sampleCaseDto;
    private VerdictDto sampleVerdictDto;

    @BeforeEach
    void setUp() {
        UUID caseId = UUID.randomUUID();
        sampleUser = User.builder().id(UUID.randomUUID()).role(Role.LAWYER).build();

        sampleCaseDto = CaseDto.builder()
                .id(caseId)
                .caseNumber("CASE-2026-PDF")
                .offenceSection("379")
                .status(CaseStatus.EVALUATED)
                .createdAt(Instant.now())
                .build();

        sampleVerdictDto = VerdictDto.builder()
                .id(UUID.randomUUID())
                .caseId(caseId)
                .outcome("ELIGIBLE")
                .riskBand("LOW")
                .flightRiskScore(10)
                .evidenceRiskScore(10)
                .proceduralStatus("READY_TO_FILE")
                .evaluatedAt(Instant.now())
                .build();
    }

    @Test
    @DisplayName("Generate PDF Report - Valid Byte Array Returned")
    void testGeneratePdfReport() {
        UUID caseId = sampleCaseDto.getId();
        when(caseService.getCaseById(caseId, sampleUser)).thenReturn(sampleCaseDto);
        when(eligibilityService.getVerdictsForCase(caseId, sampleUser)).thenReturn(Collections.singletonList(sampleVerdictDto));

        byte[] pdfBytes = pdfReportService.generatePdfReport(caseId, sampleUser);

        assertNotNull(pdfBytes);
        assertTrue(pdfBytes.length > 0);
    }
}
