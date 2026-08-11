package com.backend.bailreckoner.dto;

import lombok.Builder;
import lombok.Data;

import java.time.Instant;
import java.util.UUID;

@Data
@Builder
public class LawSectionDto {
    private UUID id;
    private String lawName;
    private String sectionNumber;
    private String title;
    private String description;
    private String plainLanguageSummary;
    private Boolean bailable;
    private Integer maximumSentenceYears;
    private String ipcEquivalent;
    private String bnsEquivalent;
    private String crpcEquivalent;
    private String bnssEquivalent;
    private String source;
    private String repositoryVersion;
    private Instant verifiedAt;
    private Boolean active;
}
