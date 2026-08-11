package com.backend.bailreckoner;

import com.backend.bailreckoner.dto.VerdictDto;
import com.backend.bailreckoner.entity.CaseEntity;
import com.backend.bailreckoner.entity.LawSection;
import com.backend.bailreckoner.entity.User;
import com.backend.bailreckoner.entity.Verdict;
import com.backend.bailreckoner.enums.Role;
import com.backend.bailreckoner.repository.CaseRepository;
import com.backend.bailreckoner.repository.LawSectionRepository;
import com.backend.bailreckoner.repository.VerdictRepository;
import com.backend.bailreckoner.service.AuditService;
import com.backend.bailreckoner.service.CaseService;
import com.backend.bailreckoner.service.EligibilityService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Spy;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class EligibilityServiceTest {

    @Mock
    private CaseService caseService;

    @Mock
    private CaseRepository caseRepository;

    @Mock
    private LawSectionRepository lawSectionRepository;

    @Mock
    private VerdictRepository verdictRepository;

    @Mock
    private AuditService auditService;

    @Spy
    private ObjectMapper objectMapper = new ObjectMapper();

    @InjectMocks
    private EligibilityService eligibilityService;

    private User sampleUser;
    private CaseEntity sampleCase;
    private LawSection sampleLaw;

    @BeforeEach
    void setUp() {
        UUID userId = UUID.randomUUID();
        sampleUser = User.builder()
                .id(userId)
                .name("Lawyer Test")
                .email("lawyer@test.com")
                .role(Role.LAWYER)
                .build();

        UUID caseId = UUID.randomUUID();
        sampleCase = CaseEntity.builder()
                .id(caseId)
                .caseNumber("CASE-TEST-101")
                .offenceSection("379")
                .offenceType("Theft")
                .maximumSentenceYears(3)
                .custodyStartDate(LocalDate.now().minusMonths(14))
                .firstTimeOffender(true)
                .residentialStability(true)
                .employmentStatus("EMPLOYED")
                .dependents(2)
                .previousCourtAppearances(1)
                .previousAbsconding(false)
                .witnessTampering(false)
                .coAccused(false)
                .evidenceType("DOCUMENTARY")
                .caseStage("UNDER_INVESTIGATION")
                .suretyAvailable(true)
                .bondReady(true)
                .identificationReady(true)
                .createdBy(sampleUser)
                .build();

        sampleLaw = LawSection.builder()
                .id(UUID.randomUUID())
                .lawName("Indian Penal Code")
                .sectionNumber("379")
                .title("Theft")
                .bailable(true)
                .maximumSentenceYears(3)
                .build();
    }

    @Test
    @DisplayName("Evaluate Case - Bailable Offence returning ELIGIBLE")
    void testEvaluateCaseBailableOffence() {
        when(caseService.getCaseEntityWithPermissionCheck(sampleCase.getId(), sampleUser)).thenReturn(sampleCase);
        when(lawSectionRepository.findBySectionNumber("379")).thenReturn(Optional.of(sampleLaw));
        when(verdictRepository.save(any(Verdict.class))).thenAnswer(i -> {
            Verdict v = i.getArgument(0);
            v.setId(UUID.randomUUID());
            return v;
        });

        VerdictDto verdict = eligibilityService.evaluateCase(sampleCase.getId(), sampleUser);

        assertNotNull(verdict);
        assertEquals("ELIGIBLE", verdict.getOutcome());
        assertEquals("LOW", verdict.getRiskBand());
        assertEquals(5, verdict.getRuleTrace().size());
        verify(verdictRepository, times(1)).save(any(Verdict.class));
    }

    @Test
    @DisplayName("Evaluate Case - Flight Risk Score & Evidence Risk Calculation")
    void testFlightRiskAndEvidenceRiskCalculation() {
        sampleCase.setResidentialStability(false); // +30
        sampleCase.setEmploymentStatus("UNEMPLOYED"); // +20
        sampleCase.setPreviousAbsconding(true); // +40 -> Flight risk > 60 (HIGH)
        sampleLaw.setBailable(false);

        when(caseService.getCaseEntityWithPermissionCheck(sampleCase.getId(), sampleUser)).thenReturn(sampleCase);
        when(lawSectionRepository.findBySectionNumber("379")).thenReturn(Optional.of(sampleLaw));
        when(verdictRepository.save(any(Verdict.class))).thenAnswer(i -> {
            Verdict v = i.getArgument(0);
            v.setId(UUID.randomUUID());
            return v;
        });

        VerdictDto verdict = eligibilityService.evaluateCase(sampleCase.getId(), sampleUser);

        assertNotNull(verdict);
        assertTrue(verdict.getFlightRiskScore() >= 60);
        assertEquals("NOT_ELIGIBLE", verdict.getOutcome());
        assertEquals("HIGH", verdict.getRiskBand());
    }
}
