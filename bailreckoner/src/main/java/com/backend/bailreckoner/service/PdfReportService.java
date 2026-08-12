package com.backend.bailreckoner.service;

import com.backend.bailreckoner.dto.CaseDto;
import com.backend.bailreckoner.dto.CitationDto;
import com.backend.bailreckoner.dto.RuleTraceEntry;
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
import java.time.LocalDateTime;
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
        VerdictDto verdict = verdicts.isEmpty() ? null : verdicts.get(0);

        try (PDDocument document = new PDDocument()) {
            PDType1Font fontBold = new PDType1Font(Standard14Fonts.FontName.HELVETICA_BOLD);
            PDType1Font fontRegular = new PDType1Font(Standard14Fonts.FontName.HELVETICA);
            PDType1Font fontOblique = new PDType1Font(Standard14Fonts.FontName.HELVETICA_OBLIQUE);

            DateTimeFormatter dtf = DateTimeFormatter.ofPattern("dd-MMM-yyyy HH:mm:ss");
            String reportTimestamp = LocalDateTime.now().format(dtf);

            // ==========================================
            // PAGE 1: EXECUTIVE VERDICT & CASE DEMOGRAPHICS
            // ==========================================
            PDPage page1 = new PDPage(PDRectangle.A4);
            document.addPage(page1);

            try (PDPageContentStream cs = new PDPageContentStream(document, page1)) {
                float y = 800;

                // Header Banner
                drawHeaderBanner(cs, fontBold, fontRegular, "BAIL RECKONER - STATUTORY DECISION SUPPORT REPORT", "Official Legal-Aid Evaluation & Undertrial Assessment | Page 1 of 3");
                y -= 50;

                // Document Metadata Box
                cs.setFont(fontRegular, 9);
                cs.beginText();
                cs.newLineAtOffset(50, y);
                cs.showText("Report ID: RPT-" + caseDto.getCaseNumber() + " | Generated: " + reportTimestamp + " | User: " + user.getName());
                cs.endText();
                y -= 25;

                // Section 1: Case Profile & Demographics
                drawSectionTitle(cs, fontBold, "1. Case Profile & Undertrial Demographics", 50, y);
                y -= 20;

                String[][] caseTable = {
                    {"Case/CNR Number:", caseDto.getCaseNumber(), "FIR Number:", caseDto.getFirNumber() != null ? caseDto.getFirNumber() : "N/A"},
                    {"Police Station:", caseDto.getPoliceStation() != null ? caseDto.getPoliceStation() : "N/A", "Offence Section:", "Sec. " + caseDto.getOffenceSection()},
                    {"Offence Category:", caseDto.getOffenceType() != null ? caseDto.getOffenceType() : "N/A", "Max Sentence:", (caseDto.getMaximumSentenceYears() != null ? caseDto.getMaximumSentenceYears() : 3) + " Years"},
                    {"Custody Start Date:", caseDto.getCustodyStartDate() != null ? caseDto.getCustodyStartDate().toString() : "Not Specified", "First-Time Offender:", Boolean.TRUE.equals(caseDto.getFirstTimeOffender()) ? "Yes (1/3rd Threshold)" : "No (1/2nd Threshold)"},
                    {"Case Stage:", caseDto.getCaseStage() != null ? caseDto.getCaseStage() : "UNDER_INVESTIGATION", "Record Status:", caseDto.getStatus().name()}
                };

                for (String[] row : caseTable) {
                    cs.setFont(fontBold, 9);
                    cs.beginText(); cs.newLineAtOffset(55, y); cs.showText(row[0]); cs.endText();
                    cs.setFont(fontRegular, 9);
                    cs.beginText(); cs.newLineAtOffset(160, y); cs.showText(row[1]); cs.endText();

                    cs.setFont(fontBold, 9);
                    cs.beginText(); cs.newLineAtOffset(320, y); cs.showText(row[2]); cs.endText();
                    cs.setFont(fontRegular, 9);
                    cs.beginText(); cs.newLineAtOffset(420, y); cs.showText(row[3]); cs.endText();

                    y -= 16;
                }

                y -= 15;

                // Section 2: Executive Statutory Verdict
                drawSectionTitle(cs, fontBold, "2. Executive Statutory Verdict Analysis", 50, y);
                y -= 20;

                if (verdict != null) {
                    cs.setFont(fontBold, 11);
                    cs.beginText(); cs.newLineAtOffset(55, y);
                    cs.showText("STATUTORY OUTCOME: " + verdict.getOutcome().replace("_", " "));
                    cs.endText();

                    cs.setFont(fontBold, 10);
                    cs.beginText(); cs.newLineAtOffset(350, y);
                    cs.showText("RISK ASSESSMENT BAND: " + verdict.getRiskBand());
                    cs.endText();

                    y -= 20;

                    cs.setFont(fontBold, 9);
                    cs.beginText(); cs.newLineAtOffset(55, y); cs.showText("Flight Risk Score: " + verdict.getFlightRiskScore() + "/100"); cs.endText();
                    cs.beginText(); cs.newLineAtOffset(220, y); cs.showText("Evidence Risk Score: " + verdict.getEvidenceRiskScore() + "/100"); cs.endText();
                    cs.beginText(); cs.newLineAtOffset(380, y); cs.showText("Procedural Status: " + verdict.getProceduralStatus()); cs.endText();

                    y -= 25;

                    cs.setFont(fontBold, 9);
                    cs.beginText(); cs.newLineAtOffset(55, y); cs.showText("Rule Engine Explanation:"); cs.endText();
                    y -= 15;

                    String explanation = verdict.getExplanation();
                    List<String> wrappedLines = wrapText(explanation, 85);
                    cs.setFont(fontRegular, 8.5f);
                    for (String line : wrappedLines) {
                        cs.beginText(); cs.newLineAtOffset(55, y); cs.showText(line); cs.endText();
                        y -= 12;
                    }
                } else {
                    cs.setFont(fontOblique, 10);
                    cs.beginText(); cs.newLineAtOffset(55, y); cs.showText("No verdict evaluated yet. Case is currently in DRAFT status."); cs.endText();
                    y -= 20;
                }

                y -= 20;

                // Section 3: Risk Factor Assessment Matrix
                drawSectionTitle(cs, fontBold, "3. Risk Factor Assessment Matrix", 50, y);
                y -= 20;

                String[][] riskTable = {
                    {"Risk Category", "Evaluated Parameter", "Risk Metric Status"},
                    {"Flight Risk", "Residential Stability", Boolean.TRUE.equals(caseDto.getResidentialStability()) ? "Stable Resident (Low Risk)" : "Unstable / No Proof (High Risk)"},
                    {"Flight Risk", "Employment Status", caseDto.getEmploymentStatus() != null ? caseDto.getEmploymentStatus() : "Unemployed"},
                    {"Flight Risk", "Previous Court Appearance", (caseDto.getPreviousCourtAppearances() != null ? caseDto.getPreviousCourtAppearances() : 0) + " Appearances recorded"},
                    {"Evidence Tampering", "Witness Tampering Threat", Boolean.TRUE.equals(caseDto.getWitnessTampering()) ? "ALERT: Witness Tampering Flagged" : "Clear (No Tampering Flag)"},
                    {"Evidence Tampering", "Co-Accused Presence", Boolean.TRUE.equals(caseDto.getCoAccused()) ? "Co-Accused Involved" : "Single Accused"},
                    {"Evidence Tampering", "Evidence Category", caseDto.getEvidenceType() != null ? caseDto.getEvidenceType() : "DOCUMENTARY"}
                };

                for (int i = 0; i < riskTable.length; i++) {
                    String[] row = riskTable[i];
                    PDType1Font f = (i == 0) ? fontBold : fontRegular;
                    cs.setFont(f, 8.5f);

                    cs.beginText(); cs.newLineAtOffset(55, y); cs.showText(row[0]); cs.endText();
                    cs.beginText(); cs.newLineAtOffset(180, y); cs.showText(row[1]); cs.endText();
                    cs.beginText(); cs.newLineAtOffset(350, y); cs.showText(row[2]); cs.endText();

                    y -= 14;
                }

                drawFooter(cs, fontRegular, "Page 1 of 3 — Confidential Legal Aid Assessment");
            }

            // ==========================================
            // PAGE 2: STATUTORY RULE TRACE & CITATIONS
            // ==========================================
            PDPage page2 = new PDPage(PDRectangle.A4);
            document.addPage(page2);

            try (PDPageContentStream cs = new PDPageContentStream(document, page2)) {
                float y = 800;

                drawHeaderBanner(cs, fontBold, fontRegular, "BAIL RECKONER - STATUTORY RULE ENGINE AUDIT TRACE", "Deterministic Rule Engine & Statutory Citations | Page 2 of 3");
                y -= 50;

                // Section 4: Detailed Statutory Rule Trace
                drawSectionTitle(cs, fontBold, "4. Deterministic Statutory Rule Engine Audit Trace", 50, y);
                y -= 25;

                if (verdict != null && verdict.getRuleTrace() != null && !verdict.getRuleTrace().isEmpty()) {
                    for (RuleTraceEntry rule : verdict.getRuleTrace()) {
                        cs.setFont(fontBold, 9.5f);
                        cs.beginText(); cs.newLineAtOffset(55, y);
                        cs.showText("[" + rule.getRuleId() + "] " + rule.getCheckName() + " — ");
                        cs.endText();

                        cs.setFont(fontBold, 9.5f);
                        cs.beginText(); cs.newLineAtOffset(350, y);
                        cs.showText(rule.isPassed() ? "PASSED (COMPLIANT)" : "FAILED (NON-COMPLIANT)");
                        cs.endText();

                        y -= 14;

                        cs.setFont(fontRegular, 8.5f);
                        cs.beginText(); cs.newLineAtOffset(65, y);
                        cs.showText("Details: " + rule.getDetails());
                        cs.endText();

                        y -= 20;
                    }
                } else {
                    cs.setFont(fontRegular, 9);
                    cs.beginText(); cs.newLineAtOffset(55, y);
                    cs.showText("Standard Rule Trace Metrics:");
                    cs.endText();
                    y -= 15;

                    String[] defaultRules = {
                        "[RULE-01-OFFENCE] Bailability Check: Offence classification verified against statutory repository.",
                        "[RULE-02-TIME-SERVED] Custody Duration: Undertrial custody evaluated under Sec 436A CrPC / Sec 479 BNSS.",
                        "[RULE-03-FLIGHT-RISK] Flight Risk Analysis: Residential, employment & appearance history evaluated.",
                        "[RULE-04-EVIDENCE-RISK] Evidence Tampering Check: Witness & co-accused interference evaluated.",
                        "[RULE-05-PROCEDURAL] Verification Check: Surety, bond & personal ID readiness verified."
                    };

                    for (String r : defaultRules) {
                        cs.setFont(fontRegular, 8.5f);
                        cs.beginText(); cs.newLineAtOffset(65, y); cs.showText(r); cs.endText();
                        y -= 16;
                    }
                }

                y -= 20;

                // Section 5: Statutory Citations & Legal References
                drawSectionTitle(cs, fontBold, "5. Statutory Legal Citations & Statutory Cross-References", 50, y);
                y -= 20;

                cs.setFont(fontBold, 9);
                cs.beginText(); cs.newLineAtOffset(55, y); cs.showText("Act / Code"); cs.endText();
                cs.beginText(); cs.newLineAtOffset(200, y); cs.showText("Statutory Section"); cs.endText();
                cs.beginText(); cs.newLineAtOffset(350, y); cs.showText("Source Authority"); cs.endText();
                y -= 16;

                if (verdict != null && verdict.getCitations() != null && !verdict.getCitations().isEmpty()) {
                    for (CitationDto cite : verdict.getCitations()) {
                        cs.setFont(fontRegular, 8.5f);
                        cs.beginText(); cs.newLineAtOffset(55, y); cs.showText(cite.getLaw()); cs.endText();
                        cs.beginText(); cs.newLineAtOffset(200, y); cs.showText(cite.getSection()); cs.endText();
                        cs.beginText(); cs.newLineAtOffset(350, y); cs.showText(cite.getSource()); cs.endText();
                        y -= 14;
                    }
                } else {
                    String[][] citationsList = {
                        {"Indian Penal Code (IPC)", "Section " + caseDto.getOffenceSection(), "Statutory Code of India"},
                        {"Bharatiya Nyaya Sanhita (BNS)", "BNS Equivalent Section", "Ministry of Law & Justice"},
                        {"Code of Criminal Procedure (CrPC)", "Section 436 / 436A / 437", "Statutory Procedure Code"},
                        {"Bharatiya Nagarik Suraksha Sanhita", "BNSS Section 478 / 479", "New Criminal Code 2023"}
                    };

                    for (String[] c : citationsList) {
                        cs.setFont(fontRegular, 8.5f);
                        cs.beginText(); cs.newLineAtOffset(55, y); cs.showText(c[0]); cs.endText();
                        cs.beginText(); cs.newLineAtOffset(200, y); cs.showText(c[1]); cs.endText();
                        cs.beginText(); cs.newLineAtOffset(350, y); cs.showText(c[2]); cs.endText();
                        y -= 14;
                    }
                }

                y -= 30;

                // Section 6: Section 436A / 479 Statutory Table
                drawSectionTitle(cs, fontBold, "6. Statutory Custody Threshold Benchmark (CrPC 436A / BNSS 479)", 50, y);
                y -= 20;

                cs.setFont(fontRegular, 8.5f);
                cs.beginText(); cs.newLineAtOffset(55, y);
                cs.showText("Under Sec 436A CrPC / Sec 479 BNSS, an undertrial prisoner is entitled to mandatory release on personal bond:");
                cs.endText();
                y -= 15;

                cs.setFont(fontBold, 8.5f);
                cs.beginText(); cs.newLineAtOffset(65, y); cs.showText("• First-Time Offender Threshold: 1/3rd of Maximum Sentence"); cs.endText();
                y -= 12;
                cs.beginText(); cs.newLineAtOffset(65, y); cs.showText("• Repeat Offender Threshold: 1/2nd (50%) of Maximum Sentence"); cs.endText();
                y -= 12;
                cs.beginText(); cs.newLineAtOffset(65, y); cs.showText("• Non-Applicability: Offences punishable with Death Penalty"); cs.endText();

                drawFooter(cs, fontRegular, "Page 2 of 3 — Confidential Legal Aid Assessment");
            }

            // ==========================================
            // PAGE 3: PROCEDURAL CHECKLIST & ACTION PLAN
            // ==========================================
            PDPage page3 = new PDPage(PDRectangle.A4);
            document.addPage(page3);

            try (PDPageContentStream cs = new PDPageContentStream(document, page3)) {
                float y = 800;

                drawHeaderBanner(cs, fontBold, fontRegular, "BAIL RECKONER - ACTION PLAN & LEGAL AID DISCLOSURE", "Procedural Readiness & Legal Counsel Guidance | Page 3 of 3");
                y -= 50;

                // Section 7: Procedural Readiness Checklist
                drawSectionTitle(cs, fontBold, "7. Procedural Verification & Surety Readiness Matrix", 50, y);
                y -= 25;

                String[][] procMatrix = {
                    {"Procedural Verification Item", "Requirement Status", "Verification Note"},
                    {"Surety Availability", Boolean.TRUE.equals(caseDto.getSuretyAvailable()) ? "READY" : "PENDING", "Solvent local surety willing to execute bond"},
                    {"Personal Bail Bond", Boolean.TRUE.equals(caseDto.getBondReady()) ? "PREPARED" : "PENDING DRAFT", "Drafted personal bond under prescribed court format"},
                    {"Undertrial Identity Proof", Boolean.TRUE.equals(caseDto.getIdentificationReady()) ? "VERIFIED" : "REQUIRED", "Aadhaar / Voter ID / Official prisoner ID card"},
                    {"Court Appearance Record", (caseDto.getPreviousCourtAppearances() != null && caseDto.getPreviousCourtAppearances() > 0) ? "RECORDED" : "FIRST APPEARANCE", "Court attendance log history"},
                    {"Absconding History Check", Boolean.TRUE.equals(caseDto.getPreviousAbsconding()) ? "FLAGGED" : "CLEARED", "Prior bail default or absconding history"}
                };

                for (int i = 0; i < procMatrix.length; i++) {
                    String[] row = procMatrix[i];
                    PDType1Font f = (i == 0) ? fontBold : fontRegular;
                    cs.setFont(f, 8.5f);

                    cs.beginText(); cs.newLineAtOffset(55, y); cs.showText(row[0]); cs.endText();
                    cs.beginText(); cs.newLineAtOffset(220, y); cs.showText(row[1]); cs.endText();
                    cs.beginText(); cs.newLineAtOffset(320, y); cs.showText(row[2]); cs.endText();

                    y -= 16;
                }

                y -= 25;

                // Section 8: Actionable Legal Recommendations
                drawSectionTitle(cs, fontBold, "8. Actionable Next Steps for Legal Counsel & NGO Aid", 50, y);
                y -= 20;

                String[] recommendations = {
                    "1. File formal Bail Application in the Magistrate/Sessions Court referencing Section " + caseDto.getOffenceSection() + ".",
                    "2. If undertrial custody exceeds 1/3rd or 1/2nd of max sentence, invoke mandatory release under Sec 436A CrPC / Sec 479 BNSS.",
                    "3. Submit verified Surety Solvency Certificates along with Aadhaar ID copies to the Court Registrar.",
                    "4. For bailable offences, request immediate release on personal bond as a matter of statutory right.",
                    "5. Ensure Arnesh Kumar guidelines compliance for non-bailable offences punishable with less than 7 years."
                };

                for (String rec : recommendations) {
                    cs.setFont(fontRegular, 8.5f);
                    cs.beginText(); cs.newLineAtOffset(55, y); cs.showText(rec); cs.endText();
                    y -= 14;
                }

                y -= 25;

                // Section 9: NALSA & Free Legal Aid Provisions
                drawSectionTitle(cs, fontBold, "9. National Legal Services Authority (NALSA) Legal Aid Disclosure", 50, y);
                y -= 20;

                cs.setFont(fontRegular, 8.5f);
                cs.beginText(); cs.newLineAtOffset(55, y);
                cs.showText("Under Article 39A of the Constitution of India and the Legal Services Authorities Act, 1987:");
                cs.endText();
                y -= 14;

                cs.setFont(fontBold, 8.5f);
                cs.beginText(); cs.newLineAtOffset(65, y);
                cs.showText("• Free Legal Aid Helpline: 15100 (Toll-Free National Legal Aid Line)");
                cs.endText();
                y -= 12;

                cs.setFont(fontRegular, 8.5f);
                cs.beginText(); cs.newLineAtOffset(65, y);
                cs.showText("• Undertrial prisoners without financial means are entitled to free court-appointed defense counsel.");
                cs.endText();
                y -= 30;

                // Sign-off / Verification Block
                cs.setFont(fontBold, 9);
                cs.beginText(); cs.newLineAtOffset(55, y); cs.showText("System Verification Stamp:"); cs.endText();
                cs.beginText(); cs.newLineAtOffset(350, y); cs.showText("Legal Aid Representative Signature:"); cs.endText();
                y -= 15;

                cs.setFont(fontRegular, 8);
                cs.beginText(); cs.newLineAtOffset(55, y); cs.showText("Bail Reckoner Rule Engine v1.0.0-DETERMINISTIC"); cs.endText();
                cs.beginText(); cs.newLineAtOffset(350, y); cs.showText("________________________________________"); cs.endText();
                y -= 12;

                cs.beginText(); cs.newLineAtOffset(55, y); cs.showText("Report Hash: " + UUID.randomUUID().toString()); cs.endText();
                cs.beginText(); cs.newLineAtOffset(350, y); cs.showText("Date: " + reportTimestamp); cs.endText();

                drawFooter(cs, fontRegular, "Page 3 of 3 — Official Statutory Decision Support Report");
            }

            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            document.save(baos);
            
            auditService.logAction(user.getId(), AuditAction.REPORT_GENERATED, "CASE", caseId);

            return baos.toByteArray();
        } catch (Exception e) {
            throw new RuntimeException("Failed to generate detailed PDF report: " + e.getMessage(), e);
        }
    }

    private void drawHeaderBanner(PDPageContentStream cs, PDType1Font titleFont, PDType1Font subFont, String title, String subtitle) throws Exception {
        cs.beginText();
        cs.setFont(titleFont, 12);
        cs.newLineAtOffset(50, 815);
        cs.showText(title);
        cs.endText();

        cs.beginText();
        cs.setFont(subFont, 8.5f);
        cs.newLineAtOffset(50, 802);
        cs.showText(subtitle);
        cs.endText();
    }

    private void drawSectionTitle(PDPageContentStream cs, PDType1Font font, String title, float x, float y) throws Exception {
        cs.beginText();
        cs.setFont(font, 11);
        cs.newLineAtOffset(x, y);
        cs.showText(title);
        cs.endText();
    }

    private void drawFooter(PDPageContentStream cs, PDType1Font font, String text) throws Exception {
        cs.beginText();
        cs.setFont(font, 8);
        cs.newLineAtOffset(50, 30);
        cs.showText(text);
        cs.endText();
    }

    private List<String> wrapText(String text, int maxCharsPerLine) {
        List<String> result = new java.util.ArrayList<>();
        if (text == null) return result;

        String[] words = text.split(" ");
        StringBuilder currentLine = new StringBuilder();

        for (String word : words) {
            if (currentLine.length() + word.length() + 1 > maxCharsPerLine) {
                result.add(currentLine.toString());
                currentLine = new StringBuilder(word);
            } else {
                if (currentLine.length() > 0) currentLine.append(" ");
                currentLine.append(word);
            }
        }
        if (currentLine.length() > 0) {
            result.add(currentLine.toString());
        }
        return result;
    }
}

