import React, { useEffect, useState } from 'react'
import { lawApi } from '../../api/lawApi'
import type { LawSectionDto } from '../../types/api'
import { CitationChip } from '../../components/ui/CitationChip'
import { Input } from '../../components/ui/Input'
import { BookOpen, Search, CheckCircle2, XCircle } from 'lucide-react'

export const LawLibraryPage: React.FC = () => {
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
    <div className="space-y-6 py-6 max-w-6xl mx-auto px-4">
      {/* Header */}
      <div className="space-y-2 border-b border-surface-deep pb-4">
        <div className="flex items-center gap-2 text-accent text-xs font-mono font-bold uppercase">
          <BookOpen className="w-4 h-4" /> Official Statutory Repository
        </div>
        <h1 className="text-2xl md:text-3xl font-serif font-bold text-ink">
          Statutory Law Library & Section Directory
        </h1>
        <p className="text-xs md:text-sm text-ink-muted leading-relaxed">
          Grounded statutory database detailing IPC / BNS equivalencies, maximum sentences, statutory bailability, and plain-language legal summaries.
        </p>
      </div>

      {/* Search Bar */}
      <div className="bg-white border border-surface-deep rounded-xl p-4 shadow-2xs max-w-xl">
        <div className="relative">
          <Input
            placeholder="Search by Section (e.g. 379, 420, 302), Title, or Keyword..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="pl-9"
          />
          <Search className="w-4 h-4 text-ink-muted absolute left-3 top-3.5" aria-hidden="true" />
        </div>
      </div>

      {/* Law Section Cards Grid */}
      {isLoading ? (
        <div className="min-h-[40vh] flex flex-col items-center justify-center space-y-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent" />
          <span className="text-xs font-mono text-ink-muted">Querying Statutory Library...</span>
        </div>
      ) : laws.length === 0 ? (
        <div className="bg-white border border-surface-deep rounded-xl p-8 text-center space-y-2 text-ink-muted">
          <p>No statutory sections found matching "{searchQuery}".</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {laws.map((law) => (
            <div
              key={law.id}
              className="bg-white border border-surface-deep rounded-2xl p-5 shadow-xs hover:shadow-md transition-shadow space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2 border-b border-surface-deep pb-3">
                  <div>
                    <CitationChip section={`Section ${law.sectionNumber}`} law={law.lawName} />
                    <h3 className="font-serif font-bold text-lg text-ink mt-1.5 leading-snug">
                      {law.title}
                    </h3>
                  </div>

                  <span
                    className={`inline-flex items-center gap-1 text-[11px] font-bold uppercase px-2.5 py-1 rounded-full border shrink-0 ${
                      law.bailable
                        ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                        : 'bg-red-50 border-red-300 text-red-950'
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
                  {law.ipcEquivalent && <span className="bg-surface-light text-ink px-2 py-0.5 rounded border border-surface-deep">{law.ipcEquivalent}</span>}
                  {law.bnsEquivalent && <span className="bg-surface-light text-ink px-2 py-0.5 rounded border border-surface-deep">{law.bnsEquivalent}</span>}
                  {law.crpcEquivalent && <span className="bg-surface-light text-ink px-2 py-0.5 rounded border border-surface-deep">{law.crpcEquivalent}</span>}
                  {law.bnssEquivalent && <span className="bg-surface-light text-ink px-2 py-0.5 rounded border border-surface-deep">{law.bnssEquivalent}</span>}
                </div>

                <p className="text-xs text-ink-muted leading-relaxed line-clamp-3">
                  {law.plainLanguageSummary || law.description}
                </p>
              </div>

              <div className="pt-3 border-t border-surface-light flex items-center justify-between text-xs text-ink-muted font-mono">
                <span>Max Sentence: <strong>{law.maximumSentenceYears} Years</strong></span>
                <span className="text-[10px] text-accent font-semibold">{law.source || 'Statute'}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
