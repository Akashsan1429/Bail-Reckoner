package com.backend.bailreckoner.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "law_sections")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LawSection {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "law_name", nullable = false)
    private String lawName;

    @Column(name = "section_number", nullable = false)
    private String sectionNumber;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "plain_language_summary", columnDefinition = "TEXT")
    private String plainLanguageSummary;

    @Column(nullable = false)
    private Boolean bailable;

    @Column(name = "maximum_sentence_years")
    private Integer maximumSentenceYears;

    @Column(name = "ipc_equivalent")
    private String ipcEquivalent;

    @Column(name = "bns_equivalent")
    private String bnsEquivalent;

    @Column(name = "crpc_equivalent")
    private String crpcEquivalent;

    @Column(name = "bnss_equivalent")
    private String bnssEquivalent;

    private String source;

    @Column(name = "repository_version")
    private String repositoryVersion;

    @Column(name = "verified_at")
    private Instant verifiedAt;

    @Column(nullable = false)
    private Boolean active;
}
