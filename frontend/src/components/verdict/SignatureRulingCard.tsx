import React, { useState } from 'react'
import type { VerdictDto, CaseDto } from '../../types/api'
import { VerdictBadge } from '../ui/VerdictBadge'
import { CitationChip } from '../ui/CitationChip'
import { RuleTraceAccordion } from '../ui/RuleTraceAccordion'
import { DisclaimerStrip } from '../ui/DisclaimerStrip'
import { Button } from '../ui/Button'
import { reportApi } from '../../api/reportApi'
import { Download, Bot, Scale, ShieldCheck } from 'lucide-react'

interface SignatureRulingCardProps {
  verdict: VerdictDto
  caseData: CaseDto
  onOpenChat?: () => void
}

export const SignatureRulingCard: React.FC<SignatureRulingCardProps> = ({
  verdict,
  caseData,
  onOpenChat,
}) => {
  const [isDownloading, setIsDownloading] = useState(false)

  const handleDownloadReport = async () => {
    try {
      setIsDownloading(true)
      await reportApi.downloadPdfReport(verdict.caseId, caseData.caseNumber)
    } catch (err) {
      console.error('PDF download error:', err)
      alert('Failed to download PDF report. Please try again.')
    } finally {
      setIsDownloading(false)
    }
  }

  // Circular Verdict Seal Color Scheme
  const sealConfig = {
    ELIGIBLE: 'border-emerald-600 bg-emerald-50 text-emerald-900',
    NOT_ELIGIBLE: 'border-red-600 bg-red-50 text-red-900',
    ELIGIBLE_WITH_CONDITIONS: 'border-amber-600 bg-amber-50 text-amber-900',
    MANUAL_REVIEW: 'border-indigo-600 bg-indigo-50 text-indigo-900',
  }[verdict.outcome] || 'border-accent bg-surface-light text-ink'

  return (
    <div className="bg-white border-2 border-surface-deep rounded-2xl p-6 md:p-8 shadow-md space-y-6 max-w-4xl mx-auto">
      {/* Header & Seal */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 border-b border-surface-deep pb-6 text-center md:text-left">
        <div className="space-y-2">
          <div className="flex items-center justify-center md:justify-start gap-2">
            <Scale className="w-5 h-5 text-accent" />
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-ink-muted">
              Official Decision-Support Assessment
            </span>
          </div>
          <h2 className="text-2xl md:text-3xl font-serif font-bold text-ink">
            Statutory Eligibility Verdict
          </h2>
          <p className="text-xs font-mono text-ink-muted">
            Case: {caseData.caseNumber} | Section: {caseData.offenceSection} | Evaluated:{' '}
            {new Date(verdict.evaluatedAt).toLocaleString()}
          </p>
        </div>

        {/* Circular Verdict Seal */}
        <div className="flex flex-col items-center">
          <div
            className={`w-28 h-28 rounded-full border-4 flex flex-col items-center justify-center text-center p-2 shadow-inner transition-transform hover:scale-105 ${sealConfig}`}
            role="region"
            aria-label={`Official Seal: ${verdict.outcome}`}
          >
            <ShieldCheck className="w-6 h-6 mb-1 text-current opacity-80" />
            <span className="text-[10px] font-mono font-bold uppercase tracking-tight leading-none mb-1">
              STATUTORY SEAL
            </span>
            <span className="text-xs font-black uppercase leading-tight">
              {verdict.outcome === 'ELIGIBLE' ? 'ELIGIBLE' : verdict.outcome === 'NOT_ELIGIBLE' ? 'NOT ELIGIBLE' : 'CONDITIONAL'}
            </span>
          </div>
        </div>
      </div>

      {/* Main Verdict Summary Box */}
      <div className="bg-surface-base border border-surface-deep rounded-xl p-5 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <VerdictBadge outcome={verdict.outcome} riskBand={verdict.riskBand} />

          <div className="flex items-center gap-2 text-xs font-mono text-ink-muted">
            <span>Flight Score: <strong>{verdict.flightRiskScore}</strong></span>
            <span>•</span>
            <span>Evidence Score: <strong>{verdict.evidenceRiskScore}</strong></span>
          </div>
        </div>

        <p className="text-sm md:text-base text-ink leading-relaxed font-sans bg-white p-4 rounded-lg border border-surface-deep shadow-2xs">
          {verdict.explanation}
        </p>
      </div>

      {/* Rule Evaluation Trace */}
      <RuleTraceAccordion ruleTrace={verdict.ruleTrace} />

      {/* Legal Reference Citations */}
      {verdict.citations && verdict.citations.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-ink-muted">
            Statutory Legal References & Citations
          </h4>
          <div className="flex flex-wrap gap-2">
            {verdict.citations.map((cite, i) => (
              <CitationChip key={i} law={cite.law} section={cite.section} source={cite.source} />
            ))}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-surface-deep pt-6">
        <Button
          onClick={handleDownloadReport}
          isLoading={isDownloading}
          variant="primary"
          size="lg"
          className="w-full sm:w-auto"
        >
          <Download className="w-5 h-5 mr-2" />
          Download PDF Report
        </Button>

        {onOpenChat && (
          <Button
            onClick={onOpenChat}
            variant="outline"
            size="lg"
            className="w-full sm:w-auto"
          >
            <Bot className="w-5 h-5 mr-2" />
            Ask AI Assistant
          </Button>
        )}
      </div>

      {/* Mandatory Legal Disclaimer Strip */}
      <DisclaimerStrip />
    </div>
  )
}
