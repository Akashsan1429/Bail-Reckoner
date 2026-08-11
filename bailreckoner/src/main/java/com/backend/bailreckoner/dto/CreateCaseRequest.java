package com.backend.bailreckoner.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.time.LocalDate;

@Data
public class CreateCaseRequest {
    @NotBlank(message = "Case number is required")
    private String caseNumber;

    private String firNumber;
    private String policeStation;

    @NotBlank(message = "Offence section is required")
    private String offenceSection;

    private String offenceType;
    private Integer maximumSentenceYears;
    private LocalDate custodyStartDate;
    private Boolean firstTimeOffender = true;
    private Boolean residentialStability = true;
    private String employmentStatus = "EMPLOYED";
    private Integer dependents = 0;
    private Integer previousCourtAppearances = 0;
    private Boolean previousAbsconding = false;
    private Boolean witnessTampering = false;
    private Boolean coAccused = false;
    private String evidenceType = "DOCUMENTARY";
    private String caseStage = "UNDER_INVESTIGATION";
    private Boolean suretyAvailable = true;
    private Boolean bondReady = true;
    private Boolean identificationReady = true;
}
