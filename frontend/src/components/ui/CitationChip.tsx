import React from 'react'
import { Scale } from 'lucide-react'

interface CitationChipProps {
  section: string
  law?: string
  source?: string
  className?: string
}

export const CitationChip: React.FC<CitationChipProps> = ({ section, law, source, className = '' }) => {
  return (
    <span
      className={`citation-chip ${className}`}
      title={source ? `Source: ${source}` : undefined}
    >
      <Scale className="w-3.5 h-3.5 text-accent" aria-hidden="true" />
      <span>{law ? `${law} ${section}` : section}</span>
    </span>
  )
}
