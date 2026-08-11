import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { caseApi } from '../../api/caseApi'
import type { CaseDto } from '../../types/api'
import { StatusBadge } from '../../components/ui/StatusBadge'
import { CitationChip } from '../../components/ui/CitationChip'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { PlusCircle, Search, Eye, Trash2, FileText } from 'lucide-react'

export const CaseHistoryPage: React.FC = () => {
  const [cases, setCases] = useState<CaseDto[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('ALL')
  const navigate = useNavigate()

  const fetchCases = async () => {
    try {
      setIsLoading(true)
      const data = await caseApi.getCases()
      setCases(data)
    } catch (err) {
      console.error('Failed to load case records:', err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchCases()
  }, [])

  const handleDeleteCase = async (id: string, caseNum: string) => {
    if (confirm(`Are you sure you want to delete case record ${caseNum}?`)) {
      try {
        await caseApi.deleteCase(id)
        setCases((prev) => prev.filter((c) => c.id !== id))
      } catch (err) {
        alert('Failed to delete case record.')
      }
    }
  }

  const filteredCases = cases.filter((item) => {
    const q = searchQuery.toLowerCase().trim()
    const matchesQuery =
      !q ||
      item.caseNumber.toLowerCase().includes(q) ||
      (item.firNumber && item.firNumber.toLowerCase().includes(q)) ||
      item.offenceSection.toLowerCase().includes(q)

    const matchesStatus = statusFilter === 'ALL' || item.status === statusFilter
    return matchesQuery && matchesStatus
  })

  return (
    <div className="space-y-6 py-6 max-w-6xl mx-auto px-4">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-surface-deep pb-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-serif font-bold text-ink">Undertrial Case Records</h1>
          <p className="text-xs text-ink-muted">Manage caseload, statutory evaluations, and judicial status</p>
        </div>

        <Button onClick={() => navigate('/cases/new')} variant="primary" size="md">
          <PlusCircle className="w-4 h-4 mr-2" /> Start New Check
        </Button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-surface-deep rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-2xs">
        <div className="relative w-full sm:w-72">
          <Input
            placeholder="Search CNR, FIR, Section..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
          <Search className="w-4 h-4 text-ink-muted absolute left-3 top-3.5" aria-hidden="true" />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs font-semibold text-ink-muted">Filter:</span>
          {['ALL', 'DRAFT', 'EVALUATED', 'ARCHIVED'].map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors min-h-[38px] cursor-pointer ${
                statusFilter === st
                  ? 'bg-accent text-white'
                  : 'bg-surface-base text-ink-muted hover:bg-surface-light'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Content Table / Cards */}
      {isLoading ? (
        <div className="min-h-[40vh] flex flex-col items-center justify-center space-y-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent" />
          <span className="text-xs font-mono text-ink-muted">Loading Case Directory...</span>
        </div>
      ) : filteredCases.length === 0 ? (
        <div className="bg-white border-2 border-dashed border-surface-deep rounded-2xl p-12 text-center space-y-4 max-w-lg mx-auto my-8">
          <div className="w-12 h-12 rounded-full bg-surface-light text-accent flex items-center justify-center mx-auto">
            <FileText className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-serif font-bold text-ink">No Saved Cases Found</h2>
          <p className="text-xs text-ink-muted">
            {searchQuery
              ? 'No case records matched your search filter criteria.'
              : 'You have not created any undertrial bail assessment records yet.'}
          </p>
          <Button onClick={() => navigate('/cases/new')} variant="primary">
            <PlusCircle className="w-4 h-4 mr-2" /> Start Your First Eligibility Check
          </Button>
        </div>
      ) : (
        <div className="bg-white border border-surface-deep rounded-2xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs md:text-sm">
              <thead>
                <tr className="bg-surface-base border-b border-surface-deep text-ink-muted font-mono font-bold uppercase text-[11px]">
                  <th className="p-4">Case / CNR Number</th>
                  <th className="p-4">Statutory Section</th>
                  <th className="p-4">Custody Start</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Created Date</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-deep">
                {filteredCases.map((item) => (
                  <tr key={item.id} className="hover:bg-surface-base/40 transition-colors">
                    <td className="p-4 font-semibold text-ink">
                      <div>{item.caseNumber}</div>
                      {item.firNumber && <div className="text-xs text-ink-muted font-mono">{item.firNumber}</div>}
                    </td>
                    <td className="p-4">
                      <CitationChip section={`Sec. ${item.offenceSection}`} law="IPC/BNS" />
                    </td>
                    <td className="p-4 font-mono text-xs text-ink-muted">
                      {item.custodyStartDate || 'N/A'}
                    </td>
                    <td className="p-4">
                      <StatusBadge status={item.status} />
                    </td>
                    <td className="p-4 font-mono text-xs text-ink-muted">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-4 text-right space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate(`/cases/${item.id}/verdict`)}
                      >
                        <Eye className="w-3.5 h-3.5 mr-1" /> View Verdict
                      </Button>
                      <button
                        type="button"
                        onClick={() => handleDeleteCase(item.id, item.caseNumber)}
                        className="p-2 text-ink-muted hover:text-verdict-not-eligible rounded-lg transition-colors inline-flex items-center min-h-[38px] cursor-pointer"
                        title="Delete Record"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
