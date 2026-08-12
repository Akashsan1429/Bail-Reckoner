import React, { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { caseApi } from '../../api/caseApi'
import type { CaseDto } from '../../types/api'
import { StatusBadge } from '../../components/ui/StatusBadge'
import { CitationChip } from '../../components/ui/CitationChip'
import { PlusCircle, Search, Eye, Trash2, FileText, Filter } from 'lucide-react'

export const CaseHistoryPage: React.FC = () => {
  const [searchParams] = useSearchParams()
  const initialQuery = searchParams.get('q') || ''
  const [cases, setCases] = useState<CaseDto[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState(initialQuery)
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
    <div className="space-y-8">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-[#1F1D36]">Undertrial Case Directory</h1>
          <p className="text-xs md:text-sm text-[#6B6888] mt-1">
            Manage undertrial records, statutory evaluations, and rule engine traces.
          </p>
        </div>

        <button
          onClick={() => navigate('/cases/new')}
          className="px-5 py-2.5 rounded-xl bg-[#403D88] hover:bg-[#312E6B] text-white text-xs font-bold shadow-md transition-all flex items-center gap-2 cursor-pointer"
        >
          <PlusCircle className="w-4 h-4" /> Start New Eligibility Check
        </button>
      </div>

      {/* Search and Filter Control Bar */}
      <div className="bg-white border border-[#EBE5F5] rounded-3xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-[#9B98B4] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search CNR, FIR, IPC Section..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#F8F7FC] border border-[#EBE5F5] text-xs font-medium text-[#1F1D36] placeholder-[#9B98B4] focus:outline-none focus:ring-2 focus:ring-[#8B639B]/30"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
          <Filter className="w-4 h-4 text-[#6B6888] shrink-0 hidden sm:block" />
          <span className="text-xs font-semibold text-[#6B6888] shrink-0 hidden sm:block">Status:</span>
          {['ALL', 'DRAFT', 'EVALUATED', 'ARCHIVED'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                statusFilter === st
                  ? 'bg-gradient-to-r from-[#F8B2B2] via-[#AF719D] to-[#8B639B] text-white shadow-sm'
                  : 'bg-[#F8F7FC] text-[#6B6888] hover:bg-[#F3EEF9]'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Directory Table */}
      {isLoading ? (
        <div className="min-h-[40vh] flex flex-col items-center justify-center space-y-3">
          <div className="w-10 h-10 rounded-full border-4 border-[#403D88] border-t-[#F8B2B2] animate-spin" />
          <span className="text-xs font-semibold text-[#6B6888]">Loading case directory...</span>
        </div>
      ) : filteredCases.length === 0 ? (
        <div className="bg-white border border-[#EBE5F5] rounded-3xl p-12 text-center space-y-4 max-w-md mx-auto my-8 shadow-sm">
          <div className="w-12 h-12 rounded-2xl bg-[#8B639B]/15 text-[#403D88] flex items-center justify-center mx-auto">
            <FileText className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-bold text-[#1F1D36]">No Case Records Found</h2>
          <p className="text-xs text-[#6B6888]">
            {searchQuery
              ? 'No undertrial records matched your search parameters.'
              : 'You have not evaluated any undertrial bail eligibility cases yet.'}
          </p>
          <button
            onClick={() => navigate('/cases/new')}
            className="px-4 py-2 rounded-xl bg-[#403D88] text-white text-xs font-bold hover:bg-[#312E6B] transition-all cursor-pointer inline-flex items-center gap-1.5"
          >
            <PlusCircle className="w-4 h-4" /> Start Eligibility Check
          </button>
        </div>
      ) : (
        <div className="bg-white border border-[#EBE5F5] rounded-3xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs md:text-sm">
              <thead>
                <tr className="bg-[#F8F7FC] border-b border-[#EBE5F5] text-[#9B98B4] font-semibold uppercase text-[10px] tracking-wider">
                  <th className="p-4">CNR / Case Number</th>
                  <th className="p-4">Statutory Section</th>
                  <th className="p-4">Custody Start</th>
                  <th className="p-4">Verdict Status</th>
                  <th className="p-4">Created Date</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F8F7FC]">
                {filteredCases.map((item) => (
                  <tr key={item.id} className="hover:bg-[#FAF7FC] transition-colors">
                    <td className="p-4 font-bold text-[#1F1D36]">
                      <div>{item.caseNumber}</div>
                      {item.firNumber && <div className="text-[11px] text-[#6B6888] font-mono font-normal">FIR: {item.firNumber}</div>}
                    </td>
                    <td className="p-4">
                      <CitationChip section={`Sec. ${item.offenceSection}`} law="IPC/BNS" />
                    </td>
                    <td className="p-4 font-mono text-xs text-[#6B6888]">
                      {item.custodyStartDate || 'N/A'}
                    </td>
                    <td className="p-4">
                      <StatusBadge status={item.status} />
                    </td>
                    <td className="p-4 text-xs text-[#6B6888]">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-4 text-right space-x-2">
                      <button
                        onClick={() => navigate(`/cases/${item.id}/verdict`)}
                        className="px-3 py-1.5 rounded-xl bg-[#403D88] text-white text-xs font-semibold hover:bg-[#312E6B] transition-colors inline-flex items-center gap-1 cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" /> View Verdict
                      </button>
                      <button
                        onClick={() => handleDeleteCase(item.id, item.caseNumber)}
                        className="p-1.5 text-[#9B98B4] hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors inline-flex items-center cursor-pointer"
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
