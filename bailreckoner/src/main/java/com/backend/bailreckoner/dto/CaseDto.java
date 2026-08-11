package com.backend.bailreckoner.dto;

import com.backend.bailreckoner.enums.CaseStatus;
import lombok.Builder;
import lombok.Data;

import java.time.Instant;
import java.time.LocalDate;
import java.util.UUID;

@Data
@Builder
public class CaseDto {
    private UUID id;
    private String caseNumber;
    private String firNumber;
    private String policeStation;
    private String offenceSection;
    private String offenceType;
    private Integer maximumSentenceYears;
    private LocalDate custodyStartDate;
    private Boolean firstTimeOffender;
    private Boolean residentialStability;
    private String employmentStatus;
    private Integer dependents;
    private Integer previousCourtAppearances;
    private Boolean previousAbsconding;
    private Boolean witnessTampering;
    private Boolean coAccused;
    private String evidenceType;
    private String caseStage;
    private Boolean suretyAvailable;
    private Boolean bondReady;
    private Boolean identificationReady;
    private CaseStatus status;
    private UUID createdById;
    private String createdByName;
    private UUID organizationId;
    private Instant createdAt;
    private Instant updatedAt;
}
