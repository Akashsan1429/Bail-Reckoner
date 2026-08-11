package com.backend.bailreckoner.service;

import com.backend.bailreckoner.dto.CaseDto;
import com.backend.bailreckoner.dto.CreateCaseRequest;
import com.backend.bailreckoner.dto.UpdateCaseRequest;
import com.backend.bailreckoner.entity.CaseEntity;
import com.backend.bailreckoner.entity.User;
import com.backend.bailreckoner.enums.AuditAction;
import com.backend.bailreckoner.enums.CaseStatus;
import com.backend.bailreckoner.enums.Role;
import com.backend.bailreckoner.repository.CaseRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CaseService {

    private final CaseRepository caseRepository;
    private final AuditService auditService;

    @Transactional
    public CaseDto createCase(CreateCaseRequest request, User user) {
        if (caseRepository.existsByCaseNumber(request.getCaseNumber())) {
            throw new IllegalArgumentException("Case number already exists");
        }

        CaseEntity caseEntity = CaseEntity.builder()
                .caseNumber(request.getCaseNumber())
                .firNumber(request.getFirNumber())
                .policeStation(request.getPoliceStation())
                .offenceSection(request.getOffenceSection())
                .offenceType(request.getOffenceType())
                .maximumSentenceYears(request.getMaximumSentenceYears())
                .custodyStartDate(request.getCustodyStartDate())
                .firstTimeOffender(request.getFirstTimeOffender() != null ? request.getFirstTimeOffender() : true)
                .residentialStability(request.getResidentialStability() != null ? request.getResidentialStability() : true)
                .employmentStatus(request.getEmploymentStatus() != null ? request.getEmploymentStatus() : "EMPLOYED")
                .dependents(request.getDependents() != null ? request.getDependents() : 0)
                .previousCourtAppearances(request.getPreviousCourtAppearances() != null ? request.getPreviousCourtAppearances() : 0)
                .previousAbsconding(request.getPreviousAbsconding() != null ? request.getPreviousAbsconding() : false)
                .witnessTampering(request.getWitnessTampering() != null ? request.getWitnessTampering() : false)
                .coAccused(request.getCoAccused() != null ? request.getCoAccused() : false)
                .evidenceType(request.getEvidenceType() != null ? request.getEvidenceType() : "DOCUMENTARY")
                .caseStage(request.getCaseStage() != null ? request.getCaseStage() : "UNDER_INVESTIGATION")
                .suretyAvailable(request.getSuretyAvailable() != null ? request.getSuretyAvailable() : true)
                .bondReady(request.getBondReady() != null ? request.getBondReady() : true)
                .identificationReady(request.getIdentificationReady() != null ? request.getIdentificationReady() : true)
                .status(CaseStatus.DRAFT)
                .createdBy(user)
                .organization(user.getOrganization())
                .build();

        caseEntity = caseRepository.save(caseEntity);
        auditService.logAction(user.getId(), AuditAction.CASE_CREATED, "CASE", caseEntity.getId());

        return mapToDto(caseEntity);
    }

    public List<CaseDto> getCasesForUser(User user) {
        List<CaseEntity> cases;
        if (user.getRole() == Role.ADMIN) {
            cases = caseRepository.findAll();
        } else {
            cases = caseRepository.findByCreatedById(user.getId());
        }
        return cases.stream().map(this::mapToDto).collect(Collectors.toList());
    }

    public CaseDto getCaseById(UUID id, User user) {
        CaseEntity caseEntity = getCaseEntityWithPermissionCheck(id, user);
        return mapToDto(caseEntity);
    }

    @Transactional
    public CaseDto updateCase(UUID id, UpdateCaseRequest request, User user) {
        CaseEntity caseEntity = getCaseEntityWithPermissionCheck(id, user);

        if (request.getFirNumber() != null) caseEntity.setFirNumber(request.getFirNumber());
        if (request.getPoliceStation() != null) caseEntity.setPoliceStation(request.getPoliceStation());
        if (request.getOffenceSection() != null) caseEntity.setOffenceSection(request.getOffenceSection());
        if (request.getOffenceType() != null) caseEntity.setOffenceType(request.getOffenceType());
        if (request.getMaximumSentenceYears() != null) caseEntity.setMaximumSentenceYears(request.getMaximumSentenceYears());
        if (request.getCustodyStartDate() != null) caseEntity.setCustodyStartDate(request.getCustodyStartDate());
        if (request.getFirstTimeOffender() != null) caseEntity.setFirstTimeOffender(request.getFirstTimeOffender());
        if (request.getResidentialStability() != null) caseEntity.setResidentialStability(request.getResidentialStability());
        if (request.getEmploymentStatus() != null) caseEntity.setEmploymentStatus(request.getEmploymentStatus());
        if (request.getDependents() != null) caseEntity.setDependents(request.getDependents());
        if (request.getPreviousCourtAppearances() != null) caseEntity.setPreviousCourtAppearances(request.getPreviousCourtAppearances());
        if (request.getPreviousAbsconding() != null) caseEntity.setPreviousAbsconding(request.getPreviousAbsconding());
        if (request.getWitnessTampering() != null) caseEntity.setWitnessTampering(request.getWitnessTampering());
        if (request.getCoAccused() != null) caseEntity.setCoAccused(request.getCoAccused());
        if (request.getEvidenceType() != null) caseEntity.setEvidenceType(request.getEvidenceType());
        if (request.getCaseStage() != null) caseEntity.setCaseStage(request.getCaseStage());
        if (request.getSuretyAvailable() != null) caseEntity.setSuretyAvailable(request.getSuretyAvailable());
        if (request.getBondReady() != null) caseEntity.setBondReady(request.getBondReady());
        if (request.getIdentificationReady() != null) caseEntity.setIdentificationReady(request.getIdentificationReady());

        caseEntity = caseRepository.save(caseEntity);
        auditService.logAction(user.getId(), AuditAction.CASE_UPDATED, "CASE", caseEntity.getId());

        return mapToDto(caseEntity);
    }

    @Transactional
    public void deleteCase(UUID id, User user) {
        CaseEntity caseEntity = getCaseEntityWithPermissionCheck(id, user);
        caseRepository.delete(caseEntity);
    }

    public CaseEntity getCaseEntityWithPermissionCheck(UUID id, User user) {
        CaseEntity caseEntity = caseRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Case not found"));

        if (user.getRole() != Role.ADMIN && !caseEntity.getCreatedBy().getId().equals(user.getId())) {
            throw new SecurityException("Access denied: You do not own this case");
        }

        return caseEntity;
    }

    public CaseDto mapToDto(CaseEntity caseEntity) {
        return CaseDto.builder()
                .id(caseEntity.getId())
                .caseNumber(caseEntity.getCaseNumber())
                .firNumber(caseEntity.getFirNumber())
                .policeStation(caseEntity.getPoliceStation())
                .offenceSection(caseEntity.getOffenceSection())
                .offenceType(caseEntity.getOffenceType())
                .maximumSentenceYears(caseEntity.getMaximumSentenceYears())
                .custodyStartDate(caseEntity.getCustodyStartDate())
                .firstTimeOffender(caseEntity.getFirstTimeOffender())
                .residentialStability(caseEntity.getResidentialStability())
                .employmentStatus(caseEntity.getEmploymentStatus())
                .dependents(caseEntity.getDependents())
                .previousCourtAppearances(caseEntity.getPreviousCourtAppearances())
                .previousAbsconding(caseEntity.getPreviousAbsconding())
                .witnessTampering(caseEntity.getWitnessTampering())
                .coAccused(caseEntity.getCoAccused())
                .evidenceType(caseEntity.getEvidenceType())
                .caseStage(caseEntity.getCaseStage())
                .suretyAvailable(caseEntity.getSuretyAvailable())
                .bondReady(caseEntity.getBondReady())
                .identificationReady(caseEntity.getIdentificationReady())
                .status(caseEntity.getStatus())
                .createdById(caseEntity.getCreatedBy().getId())
                .createdByName(caseEntity.getCreatedBy().getName())
                .organizationId(caseEntity.getOrganization() != null ? caseEntity.getOrganization().getId() : null)
                .createdAt(caseEntity.getCreatedAt())
                .updatedAt(caseEntity.getUpdatedAt())
                .build();
    }
}
