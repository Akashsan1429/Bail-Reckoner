import React from 'react'
import { FileText, CheckCheck, Archive } from 'lucide-react'
import type { CaseStatus } from '../../types/api'

interface StatusBadgeProps {
  status: CaseStatus
  className?: string
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className = '' }) => {
  const config = {
    DRAFT: {
      label: 'DRAFT',
      bg: 'bg-slate-100 border-slate-300 text-slate-800',
      icon: <FileText className="w-3.5 h-3.5 text-slate-600" aria-hidden="true" />,
    },
    EVALUATED: {
      label: 'EVALUATED',
      bg: 'bg-teal-100 border-teal-300 text-teal-900',
      icon: <CheckCheck className="w-3.5 h-3.5 text-teal-700" aria-hidden="true" />,
    },
    ARCHIVED: {
      label: 'ARCHIVED',
      bg: 'bg-gray-100 border-gray-300 text-gray-700',
      icon: <Archive className="w-3.5 h-3.5 text-gray-500" aria-hidden="true" />,
    },
  }[status] || {
    label: status,
    bg: 'bg-gray-100 border-gray-300 text-gray-800',
    icon: <FileText className="w-3.5 h-3.5" aria-hidden="true" />,
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md border text-xs font-semibold uppercase ${config.bg} ${className}`}
      role="status"
    >
      {config.icon}
      <span>{config.label}</span>
    </span>
  )
}
