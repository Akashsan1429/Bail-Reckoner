package com.backend.bailreckoner.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class VerdictDto {
    private UUID id;
    private UUID caseId;
    private String outcome;
    private String riskBand;
    private String explanation;
    private Integer flightRiskScore;
    private Integer evidenceRiskScore;
    private String proceduralStatus;
    private List<RuleTraceEntry> ruleTrace;
    private List<CitationDto> citations;
    private String ruleEngineVersion;
    private String lawRepositoryVersion;
    private Instant evaluatedAt;
}
