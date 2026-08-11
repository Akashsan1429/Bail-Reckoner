package com.backend.bailreckoner.service;

import com.backend.bailreckoner.dto.CaseDto;
import com.backend.bailreckoner.dto.VerdictDto;
import com.backend.bailreckoner.entity.User;
import com.backend.bailreckoner.enums.AuditAction;
import lombok.RequiredArgsConstructor;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDPage;
import org.apache.pdfbox.pdmodel.PDPageContentStream;
import org.apache.pdfbox.pdmodel.common.PDRectangle;
import org.apache.pdfbox.pdmodel.font.PDType1Font;
import org.apache.pdfbox.pdmodel.font.Standard14Fonts;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class PdfReportService {

    private final CaseService caseService;
    private final EligibilityService eligibilityService;
    private final AuditService auditService;

    public byte[] generatePdfReport(UUID caseId, User user) {
        CaseDto caseDto = caseService.getCaseById(caseId, user);
        List<VerdictDto> verdicts = eligibilityService.getVerdictsForCase(caseId, user);
        VerdictDto latestVerdict = verdicts.isEmpty() ? null : verdicts.get(0);

        try (PDDocument document = new PDDocument()) {
            PDPage page = new PDPage(PDRectangle.A4);
            document.addPage(page);

            try (PDPageContentStream contentStream = new PDPageContentStream(document, page)) {
                PDType1Font titleFont = new PDType1Font(Standard14Fonts.FontName.HELVETICA_BOLD);
                PDType1Font sectionFont = new PDType1Font(Standard14Fonts.FontName.HELVETICA_BOLD);
                PDType1Font bodyFont = new PDType1Font(Standard14Fonts.FontName.HELVETICA);

                float y = 800;

                // Title
                contentStream.beginText();
                contentStream.setFont(titleFont, 18);
                contentStream.newLineAtOffset(50, y);
                contentStream.showText("BAIL RECKONER - DECISION SUPPORT REPORT");
                contentStream.endText();

                y -= 30;

                // Subtitle / Header info
                contentStream.beginText();
                contentStream.setFont(bodyFont, 10);
                contentStream.newLineAtOffset(50, y);
                contentStream.showText("Generated for Case: " + caseDto.getCaseNumber() + " | Date: " + DateTimeFormatter.ISO_INSTANT.format(caseDto.getCreatedAt()));
                contentStream.endText();

                y -= 25;

                // Section: Case Summary
                contentStream.beginText();
                contentStream.setFont(sectionFont, 14);
                contentStream.newLineAtOffset(50, y);
                contentStream.showText("1. Case Summary");
                contentStream.endText();

                y -= 20;

                String[] summaryLines = {
                    "Case Number: " + caseDto.getCaseNumber(),
                    "FIR Number: " + (caseDto.getFirNumber() != null ? caseDto.getFirNumber() : "N/A"),
                    "Police Station: " + (caseDto.getPoliceStation() != null ? caseDto.getPoliceStation() : "N/A"),
                    "Offence Section: " + caseDto.getOffenceSection(),
                    "Offence Type: " + (caseDto.getOffenceType() != null ? caseDto.getOffenceType() : "N/A"),
                    "First Time Offender: " + caseDto.getFirstTimeOffender(),
                    "Case Status: " + caseDto.getStatus()
                };

                for (String line : summaryLines) {
                    contentStream.beginText();
                    contentStream.setFont(bodyFont, 10);
                    contentStream.newLineAtOffset(60, y);
                    contentStream.showText(line);
                    contentStream.endText();
                    y -= 15;
                }

                y -= 10;

                // Section: Eligibility Verdict
                contentStream.beginText();
                contentStream.setFont(sectionFont, 14);
                contentStream.newLineAtOffset(50, y);
                contentStream.showText("2. Statutory Eligibility Verdict");
                contentStream.endText();

                y -= 20;

                if (latestVerdict != null) {
                    String[] verdictLines = {
                        "Outcome: " + latestVerdict.getOutcome(),
                        "Risk Band: " + latestVerdict.getRiskBand(),
                        "Flight Risk Score: " + latestVerdict.getFlightRiskScore(),
                        "Evidence Risk Score: " + latestVerdict.getEvidenceRiskScore(),
                        "Procedural Status: " + latestVerdict.getProceduralStatus(),
                        "Evaluated At: " + DateTimeFormatter.ISO_INSTANT.format(latestVerdict.getEvaluatedAt())
                    };

                    for (String line : verdictLines) {
                        contentStream.beginText();
                        contentStream.setFont(bodyFont, 10);
                        contentStream.newLineAtOffset(60, y);
                        contentStream.showText(line);
                        contentStream.endText();
                        y -= 15;
                    }
                } else {
                    contentStream.beginText();
                    contentStream.setFont(bodyFont, 10);
                    contentStream.newLineAtOffset(60, y);
                    contentStream.showText("Case has not been evaluated yet.");
                    contentStream.endText();
                    y -= 15;
                }

                y -= 25;

                // Section: Disclaimer
                contentStream.beginText();
                contentStream.setFont(sectionFont, 12);
                contentStream.newLineAtOffset(50, y);
                contentStream.showText("Legal Disclaimer");
                contentStream.endText();

                y -= 15;

                contentStream.beginText();
                contentStream.setFont(bodyFont, 9);
                contentStream.newLineAtOffset(50, y);
                contentStream.showText("This decision support report is produced for informational assistance only and does not replace formal legal advice.");
                contentStream.endText();
            }

            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            document.save(baos);
            
            auditService.logAction(user.getId(), AuditAction.REPORT_GENERATED, "CASE", caseId);

            return baos.toByteArray();
        } catch (Exception e) {
            throw new RuntimeException("Failed to generate PDF report: " + e.getMessage(), e);
        }
    }
}
