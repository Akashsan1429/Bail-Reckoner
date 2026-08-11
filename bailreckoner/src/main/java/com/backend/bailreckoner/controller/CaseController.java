package com.backend.bailreckoner.controller;

import com.backend.bailreckoner.dto.CaseDto;
import com.backend.bailreckoner.dto.CreateCaseRequest;
import com.backend.bailreckoner.dto.UpdateCaseRequest;
import com.backend.bailreckoner.entity.User;
import com.backend.bailreckoner.service.CaseService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/cases")
@RequiredArgsConstructor
public class CaseController {

    private final CaseService caseService;

    @PostMapping
    public ResponseEntity<CaseDto> createCase(
            @Valid @RequestBody CreateCaseRequest request,
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(caseService.createCase(request, user));
    }

    @GetMapping
    public ResponseEntity<List<CaseDto>> getCases(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(caseService.getCasesForUser(user));
    }

    @GetMapping("/{id}")
    public ResponseEntity<CaseDto> getCaseById(
            @PathVariable UUID id,
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(caseService.getCaseById(id, user));
    }

    @PutMapping("/{id}")
    public ResponseEntity<CaseDto> updateCase(
            @PathVariable UUID id,
            @Valid @RequestBody UpdateCaseRequest request,
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(caseService.updateCase(id, request, user));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCase(
            @PathVariable UUID id,
            @AuthenticationPrincipal User user) {
        caseService.deleteCase(id, user);
        return ResponseEntity.noContent().build();
    }
}
