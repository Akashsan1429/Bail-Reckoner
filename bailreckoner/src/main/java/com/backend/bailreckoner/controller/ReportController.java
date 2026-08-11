package com.backend.bailreckoner.controller;

import com.backend.bailreckoner.entity.User;
import com.backend.bailreckoner.service.PdfReportService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/cases")
@RequiredArgsConstructor
public class ReportController {

    private final PdfReportService pdfReportService;

    @PostMapping("/{caseId}/report")
    public ResponseEntity<byte[]> generateReport(
            @PathVariable UUID caseId,
            @AuthenticationPrincipal User user) {
        byte[] pdfBytes = pdfReportService.generatePdfReport(caseId, user);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_PDF);
        headers.setContentDispositionFormData("attachment", "bail_reckoner_report_" + caseId + ".pdf");
        headers.setContentLength(pdfBytes.length);

        return ResponseEntity.ok()
                .headers(headers)
                .body(pdfBytes);
    }
}
