package com.backend.bailreckoner.controller;

import com.backend.bailreckoner.dto.LawSectionDto;
import com.backend.bailreckoner.service.LawService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/laws")
@RequiredArgsConstructor
public class LawController {

    private final LawService lawService;

    @GetMapping
    public ResponseEntity<List<LawSectionDto>> getAllLaws() {
        return ResponseEntity.ok(lawService.getAllLaws());
    }

    @GetMapping("/{id}")
    public ResponseEntity<LawSectionDto> getLawById(@PathVariable UUID id) {
        return ResponseEntity.ok(lawService.getLawById(id));
    }

    @GetMapping("/search")
    public ResponseEntity<List<LawSectionDto>> searchLaws(@RequestParam String query) {
        return ResponseEntity.ok(lawService.searchLaws(query));
    }
}
