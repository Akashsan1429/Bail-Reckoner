import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { caseApi } from '../../api/caseApi'
import type { CaseDto } from '../../types/api'
import { Button } from '../../components/ui/Button'
import { StatusBadge } from '../../components/ui/StatusBadge'
import { CitationChip } from '../../components/ui/CitationChip'
import { DisclaimerStrip } from '../../components/ui/DisclaimerStrip'
import { PlusCircle, FileText, Bot, Shield, CheckCircle2, Clock } from 'lucide-react'

interface RoleDashboardPageProps {
  onOpenChat: () => void
}

export const RoleDashboardPage: React.FC<RoleDashboardPageProps> = ({ onOpenChat }) => {
  const { user } = useAuth()
  const navigate = useNavigate()
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

  const evaluatedCount = cases.filter((c) => c.status === 'EVALUATED').length
  const draftCount = cases.filter((c) => c.status === 'DRAFT').length

  return (
    <div className="space-y-8 py-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Welcome Banner */}
      <div className="bg-white border-2 border-surface-deep rounded-2xl p-6 md:p-8 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-light text-accent text-xs font-mono font-bold uppercase">
            <Shield className="w-3.5 h-3.5" /> Role: {user?.role?.replace('_', ' ')}
          </div>
          <h1 className="text-2xl md:text-3xl font-serif font-bold text-ink">
            Welcome back, {user?.name}
          </h1>
          <p className="text-xs md:text-sm text-ink-muted">
            {user?.organizationName ? `Organization: ${user.organizationName} | ` : ''}
            Bail Reckoner Legal-Aid Decision Support Dashboard
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          <Button onClick={() => navigate('/cases/new')} variant="primary" size="md">
            <PlusCircle className="w-4 h-4 mr-2" /> Start Eligibility Check
          </Button>

          <Button onClick={onOpenChat} variant="outline" size="md">
            <Bot className="w-4 h-4 mr-2" /> AI Assistant
          </Button>
        </div>
      </div>

      {/* Dashboard Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white border border-surface-deep rounded-xl p-5 shadow-2xs space-y-1">
          <span className="text-xs font-mono text-ink-muted uppercase">Total Caseload</span>
          <div className="text-3xl font-serif font-bold text-ink">{cases.length}</div>
          <p className="text-[11px] text-ink-muted">Recorded in system</p>
        </div>

        <div className="bg-white border border-surface-deep rounded-xl p-5 shadow-2xs space-y-1">
          <span className="text-xs font-mono text-emerald-800 uppercase flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Evaluated Verdicts
          </span>
          <div className="text-3xl font-serif font-bold text-emerald-900">{evaluatedCount}</div>
          <p className="text-[11px] text-ink-muted">Deterministic rule verdicts</p>
        </div>

        <div className="bg-white border border-surface-deep rounded-xl p-5 shadow-2xs space-y-1">
          <span className="text-xs font-mono text-amber-900 uppercase flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-amber-600" /> Pending Drafts
          </span>
          <div className="text-3xl font-serif font-bold text-amber-950">{draftCount}</div>
          <p className="text-[11px] text-ink-muted">Awaiting rule evaluation</p>
        </div>
      </div>

      {/* Recent Cases Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-serif font-bold text-ink">Recent Undertrial Cases</h2>
          <Button variant="ghost" size="sm" onClick={() => navigate('/cases')}>
            View All Records →
          </Button>
        </div>

        {isLoading ? (
          <div className="min-h-[20vh] flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent" />
          </div>
        ) : cases.length === 0 ? (
          <div className="bg-white border border-surface-deep rounded-xl p-8 text-center space-y-3">
            <FileText className="w-8 h-8 text-ink-muted mx-auto" />
            <p className="text-sm text-ink-muted">No cases recorded yet in your active caseload.</p>
            <Button onClick={() => navigate('/cases/new')} variant="primary" size="sm">
              <PlusCircle className="w-4 h-4 mr-1" /> Start Eligibility Check
            </Button>
          </div>
        ) : (
          <div className="bg-white border border-surface-deep rounded-xl overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs md:text-sm">
                <thead>
                  <tr className="bg-surface-base border-b border-surface-deep text-ink-muted font-mono font-bold uppercase text-[11px]">
                    <th className="p-3.5">Case / CNR</th>
                    <th className="p-3.5">Section</th>
                    <th className="p-3.5">Status</th>
                    <th className="p-3.5 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-deep">
                  {cases.slice(0, 5).map((item) => (
                    <tr key={item.id} className="hover:bg-surface-base/50">
                      <td className="p-3.5 font-semibold text-ink">{item.caseNumber}</td>
                      <td className="p-3.5">
                        <CitationChip section={`Sec. ${item.offenceSection}`} />
                      </td>
                      <td className="p-3.5">
                        <StatusBadge status={item.status} />
                      </td>
                      <td className="p-3.5 text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => navigate(`/cases/${item.id}/verdict`)}
                        >
                          View Verdict
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      <DisclaimerStrip />
    </div>
  )
}
