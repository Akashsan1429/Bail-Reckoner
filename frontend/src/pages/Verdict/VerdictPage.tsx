import React, { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { caseApi } from '../../api/caseApi'
import type { CaseDto, VerdictDto } from '../../types/api'
import { SignatureRulingCard } from '../../components/verdict/SignatureRulingCard'
import { ArrowLeft, Play, AlertCircle, RefreshCw } from 'lucide-react'

interface VerdictPageProps {
  onOpenChat: () => void
}

export const VerdictPage: React.FC<VerdictPageProps> = ({ onOpenChat }) => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const [caseData, setCaseData] = useState<CaseDto | null>(null)
  const [verdict, setVerdict] = useState<VerdictDto | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isEvaluating, setIsEvaluating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchData = async () => {
    if (!id) return
    try {
      setIsLoading(true)
      setError(null)
      const caseRes = await caseApi.getCaseById(id)
      setCaseData(caseRes)

      const verdictsRes = await caseApi.getVerdicts(id)
      if (verdictsRes && verdictsRes.length > 0) {
        setVerdict(verdictsRes[0])
      } else {
        setVerdict(null)
      }
    } catch (err: any) {
      console.error('Error fetching verdict details:', err)
      setError(err.response?.data?.message || 'Failed to load assessment details.')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [id])

  const handleEvaluateNow = async () => {
    if (!id) return
    try {
      setIsEvaluating(true)
      const newVerdict = await caseApi.evaluateCase(id)
      setVerdict(newVerdict)
    } catch (err: any) {
      console.error('Evaluation error:', err)
      alert(err.response?.data?.message || 'Evaluation failed.')
    } finally {
      setIsEvaluating(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 rounded-full border-4 border-[#403D88] border-t-[#F8B2B2] animate-spin" />
        <span className="text-xs font-semibold text-[#6B6888]">Loading decision assessment trace...</span>
      </div>
    )
  }

  if (error || !caseData) {
    return (
      <div className="max-w-xl mx-auto my-12 p-8 bg-white border border-[#EBE5F5] rounded-3xl text-center space-y-4 shadow-sm">
        <AlertCircle className="w-10 h-10 text-red-500 mx-auto" />
        <h2 className="text-lg font-bold text-[#1F1D36]">Assessment Record Not Found</h2>
        <p className="text-xs text-[#6B6888]">{error || 'The requested case record could not be retrieved.'}</p>
        <button
          onClick={() => navigate('/cases')}
          className="px-4 py-2 rounded-xl bg-[#403D88] text-white text-xs font-bold hover:bg-[#312E6B] transition-all inline-flex items-center gap-2 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Case Records
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Navigation & Controls */}
      <div className="flex items-center justify-between">
        <Link
          to="/cases"
          className="inline-flex items-center gap-2 text-xs font-bold text-[#403D88] hover:underline"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Case Records
        </Link>

        {verdict && (
          <button
            onClick={handleEvaluateNow}
            disabled={isEvaluating}
            className="px-3.5 py-2 rounded-xl bg-white border border-[#EBE5F5] text-[#403D88] text-xs font-bold hover:bg-[#F8F7FC] transition-all inline-flex items-center gap-1.5 cursor-pointer shadow-2xs"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isEvaluating ? 'animate-spin' : ''}`} /> Re-evaluate Rules
          </button>
        )}
      </div>

      {verdict ? (
        <SignatureRulingCard verdict={verdict} caseData={caseData} onOpenChat={onOpenChat} />
      ) : (
        <div className="bg-white border border-[#EBE5F5] rounded-3xl p-8 text-center space-y-4 max-w-lg mx-auto shadow-sm">
          <h2 className="text-lg font-bold text-[#1F1D36]">Case Not Evaluated Yet</h2>
          <p className="text-xs text-[#6B6888]">
            Case <strong>{caseData.caseNumber}</strong> has been saved as draft but has not run through the statutory rule engine.
          </p>
          <button
            onClick={handleEvaluateNow}
            disabled={isEvaluating}
            className="px-6 py-3 rounded-2xl bg-gradient-to-r from-[#F8B2B2] via-[#AF719D] to-[#8B639B] text-white text-xs font-extrabold shadow-md hover:opacity-95 transition-all inline-flex items-center gap-2 cursor-pointer"
          >
            <Play className="w-4 h-4" /> Run Eligibility Rule Engine
          </button>
        </div>
      )}
    </div>
  )
}
