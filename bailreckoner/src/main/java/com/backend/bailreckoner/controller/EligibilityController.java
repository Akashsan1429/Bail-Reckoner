package com.backend.bailreckoner.controller;

import com.backend.bailreckoner.dto.VerdictDto;
import com.backend.bailreckoner.entity.User;
import com.backend.bailreckoner.service.EligibilityService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/cases")
@RequiredArgsConstructor
public class EligibilityController {

    private final EligibilityService eligibilityService;

    @PostMapping("/{caseId}/evaluate")
    public ResponseEntity<VerdictDto> evaluateCase(
            @PathVariable UUID caseId,
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(eligibilityService.evaluateCase(caseId, user));
    }

    @GetMapping("/{caseId}/verdicts")
    public ResponseEntity<List<VerdictDto>> getVerdicts(
            @PathVariable UUID caseId,
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(eligibilityService.getVerdictsForCase(caseId, user));
    }
}
