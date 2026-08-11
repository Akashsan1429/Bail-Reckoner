import React from 'react'
import { ShieldAlert } from 'lucide-react'

interface DisclaimerStripProps {
  className?: string
  text?: string
}

export const DisclaimerStrip: React.FC<DisclaimerStripProps> = ({
  className = '',
  text = 'This is an assistive decision-support assessment, not a formal legal order or guarantee.',
}) => {
  return (
    <div
      className={`bg-amber-50 border-l-4 border-amber-500 p-3.5 rounded-r-lg text-amber-950 text-xs md:text-sm font-medium flex items-start gap-2.5 shadow-xs ${className}`}
      role="note"
      aria-label="Legal Disclaimer"
    >
      <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" aria-hidden="true" />
      <div>
        <strong className="font-semibold block text-amber-900 mb-0.5">Legal Aid Disclaimer:</strong>
        <span>{text}</span>
      </div>
    </div>
  )
}
