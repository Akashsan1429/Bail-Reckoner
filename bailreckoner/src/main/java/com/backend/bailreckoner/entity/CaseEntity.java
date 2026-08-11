package com.backend.bailreckoner.entity;

import com.backend.bailreckoner.enums.CaseStatus;
import jakarta.persistence.*;
import lombok.*;
import java.time.Instant;
import java.time.LocalDate;
import java.util.UUID;

@Entity
@Table(name = "cases")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "case_number", nullable = false, unique = true)
    private String caseNumber;

    @Column(name = "fir_number")
    private String firNumber;

    @Column(name = "police_station")
    private String policeStation;

    @Column(name = "offence_section", nullable = false)
    private String offenceSection;

    @Column(name = "offence_type")
    private String offenceType;

    @Column(name = "maximum_sentence_years")
    private Integer maximumSentenceYears;

    @Column(name = "custody_start_date")
    private LocalDate custodyStartDate;

    @Column(name = "first_time_offender")
    private Boolean firstTimeOffender;

    @Column(name = "residential_stability")
    private Boolean residentialStability;

    @Column(name = "employment_status")
    private String employmentStatus;

    private Integer dependents;

    @Column(name = "previous_court_appearances")
    private Integer previousCourtAppearances;

    @Column(name = "previous_absconding")
    private Boolean previousAbsconding;

    @Column(name = "witness_tampering")
    private Boolean witnessTampering;

    @Column(name = "co_accused")
    private Boolean coAccused;

    @Column(name = "evidence_type")
    private String evidenceType;

    @Column(name = "case_stage")
    private String caseStage;

    @Column(name = "surety_available")
    private Boolean suretyAvailable;

    @Column(name = "bond_ready")
    private Boolean bondReady;

    @Column(name = "identification_ready")
    private Boolean identificationReady;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private CaseStatus status;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "created_by_id", nullable = false)
    private User createdBy;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "organization_id")
    private Organization organization;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    @PrePersist
    protected void onCreate() {
        Instant now = Instant.now();
        if (createdAt == null) {
            createdAt = now;
        }
        updatedAt = now;
        if (status == null) {
            status = CaseStatus.DRAFT;
        }
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = Instant.now();
    }
}
