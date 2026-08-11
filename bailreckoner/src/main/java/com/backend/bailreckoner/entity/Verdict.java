package com.backend.bailreckoner.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "verdicts")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Verdict {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "case_id", nullable = false)
    private UUID caseId;

    @Column(nullable = false)
    private String outcome;

    @Column(name = "risk_band", nullable = false)
    private String riskBand;

    @Column(columnDefinition = "TEXT")
    private String explanation;

    @Column(name = "flight_risk_score", nullable = false)
    private Integer flightRiskScore;

    @Column(name = "evidence_risk_score", nullable = false)
    private Integer evidenceRiskScore;

    @Column(name = "procedural_status", nullable = false)
    private String proceduralStatus;

    @Column(name = "rule_trace", columnDefinition = "TEXT")
    private String ruleTrace;

    @Column(name = "rule_engine_version")
    private String ruleEngineVersion;

    @Column(name = "law_repository_version")
    private String lawRepositoryVersion;

    @Column(name = "evaluated_at", nullable = false)
    private Instant evaluatedAt;

    @PrePersist
    protected void onCreate() {
        if (evaluatedAt == null) {
            evaluatedAt = Instant.now();
        }
    }
}
