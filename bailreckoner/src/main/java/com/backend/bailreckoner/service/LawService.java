package com.backend.bailreckoner.service;

import com.backend.bailreckoner.dto.LawSectionDto;
import com.backend.bailreckoner.entity.LawSection;
import com.backend.bailreckoner.repository.LawSectionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class LawService {

    private final LawSectionRepository lawSectionRepository;

    public List<LawSectionDto> getAllLaws() {
        return lawSectionRepository.findByActiveTrue().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    public LawSectionDto getLawById(UUID id) {
        LawSection law = lawSectionRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Law section not found"));
        return mapToDto(law);
    }

    public List<LawSectionDto> searchLaws(String query) {
        if (query == null || query.isBlank()) {
            return getAllLaws();
        }
        return lawSectionRepository.searchLaws(query.trim()).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    public LawSectionDto mapToDto(LawSection law) {
        return LawSectionDto.builder()
                .id(law.getId())
                .lawName(law.getLawName())
                .sectionNumber(law.getSectionNumber())
                .title(law.getTitle())
                .description(law.getDescription())
                .plainLanguageSummary(law.getPlainLanguageSummary())
                .bailable(law.getBailable())
                .maximumSentenceYears(law.getMaximumSentenceYears())
                .ipcEquivalent(law.getIpcEquivalent())
                .bnsEquivalent(law.getBnsEquivalent())
                .crpcEquivalent(law.getCrpcEquivalent())
                .bnssEquivalent(law.getBnssEquivalent())
                .source(law.getSource())
                .repositoryVersion(law.getRepositoryVersion())
                .verifiedAt(law.getVerifiedAt())
                .active(law.getActive())
                .build();
    }
}
