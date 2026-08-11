package com.backend.bailreckoner.repository;

import com.backend.bailreckoner.entity.LawSection;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface LawSectionRepository extends JpaRepository<LawSection, UUID> {
    Optional<LawSection> findBySectionNumber(String sectionNumber);
    List<LawSection> findByActiveTrue();

    @Query("SELECT l FROM LawSection l WHERE l.active = true AND " +
           "(LOWER(l.sectionNumber) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(l.title) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(l.lawName) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(l.description) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(l.plainLanguageSummary) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(l.ipcEquivalent) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(l.bnsEquivalent) LIKE LOWER(CONCAT('%', :query, '%')))")
    List<LawSection> searchLaws(@Param("query") String query);
}
