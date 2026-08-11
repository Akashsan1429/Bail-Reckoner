import React from 'react'
import { CheckCircle2, XCircle, AlertTriangle, HelpCircle } from 'lucide-react'
import type { VerdictOutcome, RiskBand } from '../../types/api'

interface VerdictBadgeProps {
  outcome: VerdictOutcome
  riskBand?: RiskBand
  className?: string
}

export const VerdictBadge: React.FC<VerdictBadgeProps> = ({ outcome, riskBand, className = '' }) => {
  const config = {
    ELIGIBLE: {
      label: 'ELIGIBLE FOR BAIL',
      bg: 'bg-emerald-100 border-emerald-300 text-emerald-900',
      icon: <CheckCircle2 className="w-5 h-5 text-emerald-700" aria-hidden="true" />,
    },
    NOT_ELIGIBLE: {
      label: 'NOT ELIGIBLE AT THIS STAGE',
      bg: 'bg-red-100 border-red-300 text-red-950',
      icon: <XCircle className="w-5 h-5 text-red-700" aria-hidden="true" />,
    },
    ELIGIBLE_WITH_CONDITIONS: {
      label: 'ELIGIBLE WITH CONDITIONS',
      bg: 'bg-amber-100 border-amber-300 text-amber-950',
      icon: <AlertTriangle className="w-5 h-5 text-amber-700" aria-hidden="true" />,
    },
    MANUAL_REVIEW: {
      label: 'MANUAL JUDICIAL REVIEW',
      bg: 'bg-indigo-100 border-indigo-300 text-indigo-950',
      icon: <HelpCircle className="w-5 h-5 text-indigo-700" aria-hidden="true" />,
    },
  }[outcome] || {
    label: outcome,
    bg: 'bg-gray-100 border-gray-300 text-gray-900',
    icon: <HelpCircle className="w-5 h-5 text-gray-700" aria-hidden="true" />,
  }

  return (
    <div
      className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-xs font-bold uppercase tracking-wider ${config.bg} ${className}`}
      role="status"
      aria-label={`Verdict Outcome: ${config.label}${riskBand ? `, Risk Band: ${riskBand}` : ''}`}
    >
      {config.icon}
      <span>{config.label}</span>
      {riskBand && (
        <span className="ml-1 pl-2 border-l border-current/20 font-semibold opacity-90">
          RISK: {riskBand}
        </span>
      )}
    </div>
  )
}
