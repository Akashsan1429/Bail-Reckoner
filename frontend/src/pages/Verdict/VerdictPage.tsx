import React, { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { caseApi } from '../../api/caseApi'
import type { CaseDto, VerdictDto } from '../../types/api'
import { SignatureRulingCard } from '../../components/verdict/SignatureRulingCard'
import { Button } from '../../components/ui/Button'
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
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-accent" />
        <span className="text-sm font-mono text-ink-muted">Loading Decision Assessment...</span>
      </div>
    )
  }

  if (error || !caseData) {
    return (
      <div className="max-w-xl mx-auto my-12 p-6 bg-white border border-surface-deep rounded-2xl text-center space-y-4 shadow-sm">
        <AlertCircle className="w-10 h-10 text-verdict-not-eligible mx-auto" />
        <h2 className="text-xl font-serif font-bold text-ink">Assessment Record Not Found</h2>
        <p className="text-xs text-ink-muted">{error || 'The requested case record could not be retrieved.'}</p>
        <Button variant="outline" onClick={() => navigate('/cases')}>
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Case Records
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6 py-6 max-w-5xl mx-auto px-4">
      {/* Top Header Navigation */}
      <div className="flex items-center justify-between">
        <Link
          to="/cases"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-accent hover:underline min-h-[44px]"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Case Records
        </Link>

        {verdict && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleEvaluateNow}
            isLoading={isEvaluating}
            className="text-xs"
          >
            <RefreshCw className="w-3.5 h-3.5 mr-1" /> Re-evaluate Rules
          </Button>
        )}
      </div>

      {verdict ? (
        <SignatureRulingCard verdict={verdict} caseData={caseData} onOpenChat={onOpenChat} />
      ) : (
        <div className="bg-white border-2 border-surface-deep rounded-2xl p-8 text-center space-y-4 max-w-lg mx-auto shadow-sm">
          <h2 className="text-xl font-serif font-bold text-ink">Case Not Evaluated Yet</h2>
          <p className="text-xs text-ink-muted">
            Case <strong>{caseData.caseNumber}</strong> has been saved as draft but has not run through the statutory rule engine.
          </p>
          <Button variant="primary" size="lg" onClick={handleEvaluateNow} isLoading={isEvaluating}>
            <Play className="w-4 h-4 mr-2" /> Run Eligibility Rule Engine
          </Button>
        </div>
      )}
    </div>
  )
}
