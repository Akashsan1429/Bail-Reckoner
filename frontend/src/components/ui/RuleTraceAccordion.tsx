import React, { useState } from 'react'
import { CheckCircle2, XCircle, ChevronDown, ChevronUp, Info } from 'lucide-react'
import type { RuleTraceEntry } from '../../types/api'

interface RuleTraceAccordionProps {
  ruleTrace: RuleTraceEntry[]
}

export const RuleTraceAccordion: React.FC<RuleTraceAccordionProps> = ({ ruleTrace }) => {
  const [openIndexes, setOpenIndexes] = useState<number[]>([0, 1, 2, 3, 4])

  const toggleIndex = (index: number) => {
    setOpenIndexes((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    )
  }

  if (!ruleTrace || ruleTrace.length === 0) {
    return null
  }

  return (
    <div className="space-y-3">
      <h3 className="text-base font-semibold text-ink flex items-center gap-2">
        <Info className="w-4 h-4 text-accent" aria-hidden="true" />
        Statutory Rule Trace & Evaluation Breakdown
      </h3>

      <div className="divide-y divide-surface-deep border border-surface-deep rounded-xl overflow-hidden bg-white shadow-xs">
        {ruleTrace.map((rule, idx) => {
          const isOpen = openIndexes.includes(idx)
          return (
            <div key={rule.ruleId || idx} className="bg-white">
              <button
                type="button"
                onClick={() => toggleIndex(idx)}
                className="w-full px-4 py-3.5 flex items-center justify-between hover:bg-surface-base/50 transition-colors text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                aria-expanded={isOpen}
              >
                <div className="flex items-center gap-3">
                  {rule.passed ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" aria-hidden="true" />
                  ) : (
                    <XCircle className="w-5 h-5 text-amber-600 shrink-0" aria-hidden="true" />
                  )}
                  <div>
                    <span className="font-semibold text-sm text-ink block">{rule.checkName}</span>
                    <span className="text-xs text-ink-muted font-mono">{rule.ruleId}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`text-xs px-2.5 py-0.5 rounded-full font-bold uppercase ${
                      rule.passed
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-900'
                    }`}
                  >
                    {rule.passed ? 'PASSED' : 'CHECK ATTACHED'}
                  </span>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-ink-muted" aria-hidden="true" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-ink-muted" aria-hidden="true" />
                  )}
                </div>
              </button>

              {isOpen && (
                <div className="px-4 py-3 bg-surface-base/40 text-xs md:text-sm text-ink-muted border-t border-surface-light font-mono leading-relaxed">
                  {rule.details}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
