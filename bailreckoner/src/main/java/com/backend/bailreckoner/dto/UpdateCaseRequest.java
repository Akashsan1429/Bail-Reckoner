package com.backend.bailreckoner.dto;

import lombok.Data;
import java.time.LocalDate;

@Data
public class UpdateCaseRequest {
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
}
