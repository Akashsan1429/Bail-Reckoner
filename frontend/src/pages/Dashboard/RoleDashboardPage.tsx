import React, { useEffect, useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { caseApi } from '../../api/caseApi'
import type { CaseDto } from '../../types/api'
import {
  FamilyDashboardView,
  LawyerDashboardView,
  NgoDashboardView,
  CourtStaffDashboardView,
  AdminDashboardView,
} from './RoleDashboardViews'

interface RoleDashboardPageProps {
  onOpenChat: () => void
}

export const RoleDashboardPage: React.FC<RoleDashboardPageProps> = ({ onOpenChat }) => {
  const { user } = useAuth()
  const [cases, setCases] = useState<CaseDto[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setIsLoading(true)
        const data = await caseApi.getCases()
        setCases(data)
      } catch (err) {
        console.error('Error loading dashboard cases:', err)
      } finally {
        setIsLoading(false)
      }
    }
    loadDashboardData()
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 rounded-full border-4 border-[#403D88] border-t-[#F8B2B2] animate-spin" />
        <p className="text-xs font-semibold text-[#6B6888]">Loading personalized legal workspace...</p>
      </div>
    )
  }

  // Role Dispatcher
  switch (user?.role) {
    case 'LAWYER':
      return <LawyerDashboardView user={user} cases={cases} onOpenChat={onOpenChat} />
    case 'NGO_ADMIN':
      return <NgoDashboardView user={user} cases={cases} onOpenChat={onOpenChat} />
    case 'COURT_STAFF':
      return <CourtStaffDashboardView user={user} cases={cases} onOpenChat={onOpenChat} />
    case 'ADMIN':
      return <AdminDashboardView user={user} cases={cases} onOpenChat={onOpenChat} />
    case 'PRISONER_FAMILY':
    default:
      return <FamilyDashboardView user={user} cases={cases} onOpenChat={onOpenChat} />
  }
}
