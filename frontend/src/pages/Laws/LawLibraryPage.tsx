import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { lawApi } from '../../api/lawApi'
import type { LawSectionDto } from '../../types/api'
import { CitationChip } from '../../components/ui/CitationChip'
import { BookOpen, Search, CheckCircle2, XCircle } from 'lucide-react'

export const LawLibraryPage: React.FC = () => {
  const { t } = useTranslation()
  const [laws, setLaws] = useState<LawSectionDto[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  const fetchLaws = async (query = '') => {
    try {
      setIsLoading(true)
      const data = query.trim() ? await lawApi.searchLaws(query.trim()) : await lawApi.getAllLaws()
      setLaws(data)
    } catch (err) {
      console.error('Error loading law repository:', err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchLaws()
  }, [])

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    setSearchQuery(val)
    fetchLaws(val)
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-[#403D88] text-xs font-bold uppercase tracking-wider">
          <BookOpen className="w-4 h-4 text-[#8B639B]" /> {t('nav.laws', { defaultValue: 'Statutory Repository' })}
        </div>
        <h1 className="text-2xl md:text-3xl font-bold text-[#1F1D36]">
          Law Library & Section Directory
        </h1>
        <p className="text-xs md:text-sm text-[#6B6888] leading-relaxed">
          Grounded statutory database detailing IPC / BNS equivalencies, maximum sentences, statutory bailability, and plain-language legal summaries.
        </p>
      </div>

      {/* Search & Filter Options */}
      <div className="bg-white border border-[#EBE5F5] rounded-3xl p-5 shadow-sm space-y-4">
        <div className="relative max-w-xl">
          <Search className="w-4 h-4 text-[#9B98B4] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by Section (e.g. 379, 420, 307, 436A), Title, or Keyword..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#F8F7FC] border border-[#EBE5F5] text-xs font-medium text-[#1F1D36] placeholder-[#9B98B4] focus:outline-none focus:ring-2 focus:ring-[#8B639B]/30"
          />
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap items-center gap-2 text-xs pt-1">
          <span className="text-[#6B6888] font-bold">Quick Filters:</span>
          {[
            { label: 'All Sections', query: '' },
            { label: 'Bailable Only', query: '379' },
            { label: 'Non-Bailable', query: '420' },
            { label: 'Custody Rules (CrPC 436A)', query: '436' },
            { label: 'Attempt / Assault', query: '307' }
          ].map((filter, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                setSearchQuery(filter.query)
                fetchLaws(filter.query)
              }}
              className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                searchQuery === filter.query
                  ? 'bg-gradient-to-r from-[#F8B2B2] via-[#AF719D] to-[#8B639B] text-white border-transparent shadow-sm'
                  : 'bg-[#F8F7FC] text-[#6B6888] border-[#EBE5F5] hover:bg-[#F3EEF9]'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      {/* Law Section Cards Grid */}
      {isLoading ? (
        <div className="min-h-[40vh] flex flex-col items-center justify-center space-y-3">
          <div className="w-10 h-10 rounded-full border-4 border-[#403D88] border-t-[#F8B2B2] animate-spin" />
          <span className="text-xs font-semibold text-[#6B6888]">Querying statutory library...</span>
        </div>
      ) : laws.length === 0 ? (
        <div className="bg-white border border-[#EBE5F5] rounded-3xl p-12 text-center space-y-2 text-[#6B6888] shadow-sm">
          <p>No statutory sections found matching "{searchQuery}".</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {laws.map((law) => (
            <div
              key={law.id}
              className="bg-white border border-[#EBE5F5] rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2 border-b border-[#EBE5F5] pb-3">
                  <div>
                    <CitationChip section={`Section ${law.sectionNumber}`} law={law.lawName} />
                    <h3 className="font-bold text-base text-[#1F1D36] mt-2 leading-snug">
                      {law.title}
                    </h3>
                  </div>

                  <span
                    className={`inline-flex items-center gap-1 text-[10px] font-bold uppercase px-2.5 py-1 rounded-full border shrink-0 ${
                      law.bailable
                        ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                        : 'bg-red-50 border-red-200 text-red-800'
                    }`}
                  >
                    {law.bailable ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Bailable
                      </>
                    ) : (
                      <>
                        <XCircle className="w-3.5 h-3.5 text-red-600" /> Non-Bailable
                      </>
                    )}
                  </span>
                </div>

                {/* Equivalencies */}
                <div className="flex flex-wrap gap-2 text-xs font-mono">
                  {law.ipcEquivalent && <span className="bg-[#F8F7FC] text-[#403D88] px-2 py-0.5 rounded-lg border border-[#EBE5F5] font-semibold">{law.ipcEquivalent}</span>}
                  {law.bnsEquivalent && <span className="bg-[#F8F7FC] text-[#8B639B] px-2 py-0.5 rounded-lg border border-[#EBE5F5] font-semibold">{law.bnsEquivalent}</span>}
                </div>

                <p className="text-xs text-[#6B6888] leading-relaxed line-clamp-3">
                  {law.plainLanguageSummary || law.description}
                </p>
              </div>

              <div className="pt-3 border-t border-[#F8F7FC] flex items-center justify-between text-xs text-[#6B6888]">
                <span>Max Sentence: <strong className="text-[#1F1D36]">{law.maximumSentenceYears} Years</strong></span>
                <span className="text-[11px] text-[#403D88] font-bold">{law.source || 'Statute'}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
