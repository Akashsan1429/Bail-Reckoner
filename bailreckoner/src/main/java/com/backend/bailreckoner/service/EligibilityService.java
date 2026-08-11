package com.backend.bailreckoner.service;

import com.backend.bailreckoner.dto.CitationDto;
import com.backend.bailreckoner.dto.RuleTraceEntry;
import com.backend.bailreckoner.dto.VerdictDto;
import com.backend.bailreckoner.entity.CaseEntity;
import com.backend.bailreckoner.entity.LawSection;
import com.backend.bailreckoner.entity.User;
import com.backend.bailreckoner.entity.Verdict;
import com.backend.bailreckoner.enums.AuditAction;
import com.backend.bailreckoner.enums.CaseStatus;
import com.backend.bailreckoner.repository.CaseRepository;
import com.backend.bailreckoner.repository.LawSectionRepository;
import com.backend.bailreckoner.repository.VerdictRepository;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.Period;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class EligibilityService {

    private final CaseService caseService;
    private final CaseRepository caseRepository;
    private final LawSectionRepository lawSectionRepository;
    private final VerdictRepository verdictRepository;
    private final AuditService auditService;
    private final ObjectMapper objectMapper;

    @Transactional
    public VerdictDto evaluateCase(UUID caseId, User currentUser) {
        CaseEntity caseEntity = caseService.getCaseEntityWithPermissionCheck(caseId, currentUser);

        List<RuleTraceEntry> ruleTrace = new ArrayList<>();
        List<CitationDto> citations = new ArrayList<>();

        // 1. Offence Check
        Optional<LawSection> lawOpt = lawSectionRepository.findBySectionNumber(caseEntity.getOffenceSection());
        LawSection law = lawOpt.orElse(null);

        boolean isBailable = law != null ? Boolean.TRUE.equals(law.getBailable()) : false;
        int maxSentenceYears = caseEntity.getMaximumSentenceYears() != null ? caseEntity.getMaximumSentenceYears()
                : (law != null && law.getMaximumSentenceYears() != null ? law.getMaximumSentenceYears() : 3);

        ruleTrace.add(RuleTraceEntry.builder()
                .ruleId("RULE-01-OFFENCE")
                .checkName("Offence Bailability Check")
                .passed(isBailable)
                .details(String.format("Offence Section %s: Bailable = %b, Max Sentence = %d years",
                        caseEntity.getOffenceSection(), isBailable, maxSentenceYears))
                .build());

        if (law != null) {
            citations.add(CitationDto.builder()
                    .law(law.getLawName())
                    .section("Section " + law.getSectionNumber())
                    .source(law.getSource() != null ? law.getSource() : "Statutory Repository")
                    .build());
        }

        // 2. Time Served Check
        long daysInCustody = 0;
        if (caseEntity.getCustodyStartDate() != null) {
            daysInCustody = ChronoUnit.DAYS.between(caseEntity.getCustodyStartDate(), LocalDate.now());
        }

        double custodyYears = daysInCustody / 365.25;
        boolean isFirstTime = Boolean.TRUE.equals(caseEntity.getFirstTimeOffender());
        double thresholdFraction = isFirstTime ? (1.0 / 3.0) : (1.0 / 2.0);
        double requiredYears = maxSentenceYears * thresholdFraction;

        boolean timeServedEligible = custodyYears >= requiredYears;

        ruleTrace.add(RuleTraceEntry.builder()
                .ruleId("RULE-02-TIME-SERVED")
                .checkName("Under-trial Custody Duration Check")
                .passed(timeServedEligible)
                .details(String.format("Served %.1f months out of required %.1f months (Threshold: %s max sentence)",
                        custodyYears * 12, requiredYears * 12, isFirstTime ? "1/3rd" : "1/2nd"))
                .build());

        // 3. Flight Risk Check
        int flightRiskScore = 0;
        if (!Boolean.TRUE.equals(caseEntity.getResidentialStability())) flightRiskScore += 30;
        if ("UNEMPLOYED".equalsIgnoreCase(caseEntity.getEmploymentStatus())) flightRiskScore += 20;
        if (caseEntity.getDependents() == null || caseEntity.getDependents() <= 0) flightRiskScore += 10;
        if (caseEntity.getPreviousCourtAppearances() != null && caseEntity.getPreviousCourtAppearances() > 2) flightRiskScore += 15;
        if (Boolean.TRUE.equals(caseEntity.getPreviousAbsconding())) flightRiskScore += 40;

        String flightRiskBand = flightRiskScore < 30 ? "LOW" : (flightRiskScore < 60 ? "MEDIUM" : "HIGH");

        ruleTrace.add(RuleTraceEntry.builder()
                .ruleId("RULE-03-FLIGHT-RISK")
                .checkName("Flight Risk Assessment")
                .passed(!"HIGH".equals(flightRiskBand))
                .details(String.format("Flight Risk Score: %d (%s)", flightRiskScore, flightRiskBand))
                .build());

        // 4. Evidence Risk Check
        int evidenceRiskScore = 0;
        if (Boolean.TRUE.equals(caseEntity.getWitnessTampering())) evidenceRiskScore += 40;
        if (Boolean.TRUE.equals(caseEntity.getCoAccused())) evidenceRiskScore += 15;
        if ("PHYSICAL".equalsIgnoreCase(caseEntity.getEvidenceType()) || "FORENSIC".equalsIgnoreCase(caseEntity.getEvidenceType())) evidenceRiskScore += 20;
        if ("INVESTIGATION".equalsIgnoreCase(caseEntity.getCaseStage()) || "UNDER_INVESTIGATION".equalsIgnoreCase(caseEntity.getCaseStage())) evidenceRiskScore += 15;

        String evidenceRiskBand = evidenceRiskScore < 30 ? "LOW" : (evidenceRiskScore < 60 ? "MEDIUM" : "HIGH");

        ruleTrace.add(RuleTraceEntry.builder()
                .ruleId("RULE-04-EVIDENCE-RISK")
                .checkName("Evidence Tampering Risk Assessment")
                .passed(!"HIGH".equals(evidenceRiskBand))
                .details(String.format("Evidence Risk Score: %d (%s)", evidenceRiskScore, evidenceRiskBand))
                .build());

        // 5. Procedural Check
        boolean surety = Boolean.TRUE.equals(caseEntity.getSuretyAvailable());
        boolean bond = Boolean.TRUE.equals(caseEntity.getBondReady());
        boolean idReady = Boolean.TRUE.equals(caseEntity.getIdentificationReady());
        boolean proceduralReady = surety && bond && idReady;

        String proceduralStatus = proceduralReady ? "READY_TO_FILE" : "PENDING_PROCEDURAL_STEP";

        ruleTrace.add(RuleTraceEntry.builder()
                .ruleId("RULE-05-PROCEDURAL")
                .checkName("Procedural & Verification Check")
                .passed(proceduralReady)
                .details(String.format("Procedural Status: %s (Surety=%b, Bond=%b, ID=%b)",
                        proceduralStatus, surety, bond, idReady))
                .build());

        // Final Outcome Calculation
        String outcome;
        String riskBand;
        if (isBailable) {
            outcome = "ELIGIBLE";
            riskBand = flightRiskBand;
        } else if ("HIGH".equals(flightRiskBand) || "HIGH".equals(evidenceRiskBand)) {
            outcome = "NOT_ELIGIBLE";
            riskBand = "HIGH";
        } else if (timeServedEligible) {
            outcome = "ELIGIBLE";
            riskBand = "LOW";
        } else if ("MEDIUM".equals(flightRiskBand) || "MEDIUM".equals(evidenceRiskBand)) {
            outcome = "ELIGIBLE_WITH_CONDITIONS";
            riskBand = "MEDIUM";
        } else {
            outcome = "ELIGIBLE_WITH_CONDITIONS";
            riskBand = "LOW";
        }

        String explanation = String.format(
                "Case evaluated under deterministic statutory rules. Statutory classification: %s. " +
                "Under-trial custody duration: %.1f months (Required threshold: %.1f months). " +
                "Flight risk score: %d (%s). Evidence tampering risk score: %d (%s). Procedural status: %s.",
                isBailable ? "Bailable Statutory Right" : "Non-Bailable Statutory Discretion",
                custodyYears * 12, requiredYears * 12,
                flightRiskScore, flightRiskBand,
                evidenceRiskScore, evidenceRiskBand,
                proceduralStatus
        );

        String ruleTraceJson;
        try {
            ruleTraceJson = objectMapper.writeValueAsString(ruleTrace);
        } catch (Exception e) {
            ruleTraceJson = "[]";
        }

        Verdict verdict = Verdict.builder()
                .caseId(caseId)
                .outcome(outcome)
                .riskBand(riskBand)
                .explanation(explanation)
                .flightRiskScore(flightRiskScore)
                .evidenceRiskScore(evidenceRiskScore)
                .proceduralStatus(proceduralStatus)
                .ruleTrace(ruleTraceJson)
                .ruleEngineVersion("1.0.0-DETERMINISTIC")
                .lawRepositoryVersion("1.0.0-STATIC")
                .build();

        verdict = verdictRepository.save(verdict);

        // Update case status to EVALUATED
        caseEntity.setStatus(CaseStatus.EVALUATED);
        caseRepository.save(caseEntity);

        auditService.logAction(currentUser.getId(), AuditAction.CASE_EVALUATED, "CASE", caseId);

        return mapToVerdictDto(verdict, ruleTrace, citations);
    }

    public List<VerdictDto> getVerdictsForCase(UUID caseId, User currentUser) {
        // Permission check
        caseService.getCaseEntityWithPermissionCheck(caseId, currentUser);

        List<Verdict> verdicts = verdictRepository.findByCaseIdOrderByEvaluatedAtDesc(caseId);
        return verdicts.stream().map(v -> {
            List<RuleTraceEntry> trace;
            try {
                trace = objectMapper.readValue(v.getRuleTrace(), new TypeReference<List<RuleTraceEntry>>() {});
            } catch (Exception e) {
                trace = new ArrayList<>();
            }
            return mapToVerdictDto(v, trace, new ArrayList<>());
        }).collect(Collectors.toList());
    }

    private VerdictDto mapToVerdictDto(Verdict v, List<RuleTraceEntry> trace, List<CitationDto> citations) {
        return VerdictDto.builder()
                .id(v.getId())
                .caseId(v.getCaseId())
                .outcome(v.getOutcome())
                .riskBand(v.getRiskBand())
                .explanation(v.getExplanation())
                .flightRiskScore(v.getFlightRiskScore())
                .evidenceRiskScore(v.getEvidenceRiskScore())
                .proceduralStatus(v.getProceduralStatus())
                .ruleTrace(trace)
                .citations(citations)
                .ruleEngineVersion(v.getRuleEngineVersion())
                .lawRepositoryVersion(v.getLawRepositoryVersion())
                .evaluatedAt(v.getEvaluatedAt())
                .build();
    }
}
