package com.backend.bailreckoner.repository;

import com.backend.bailreckoner.entity.CaseEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface CaseRepository extends JpaRepository<CaseEntity, UUID> {
    List<CaseEntity> findByCreatedById(UUID userId);
    Optional<CaseEntity> findByIdAndCreatedById(UUID id, UUID userId);
    boolean existsByCaseNumber(String caseNumber);
}
