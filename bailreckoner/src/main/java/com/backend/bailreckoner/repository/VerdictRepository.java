package com.backend.bailreckoner.repository;

import com.backend.bailreckoner.entity.Verdict;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;

public interface VerdictRepository extends JpaRepository<Verdict, UUID> {
    List<Verdict> findByCaseIdOrderByEvaluatedAtDesc(UUID caseId);
}
