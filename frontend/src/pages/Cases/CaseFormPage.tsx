import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CaseFormStepper } from '../../components/cases/CaseFormStepper'
import type { CreateCaseRequest } from '../../types/api'
import { caseApi } from '../../api/caseApi'
import { AlertCircle } from 'lucide-react'

export const CaseFormPage: React.FC = () => {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleCreateAndEvaluate = async (data: CreateCaseRequest) => {
    try {
      setIsLoading(true)
      setError(null)

      // 1. Create case in backend
      const newCase = await caseApi.createCase(data)

      // 2. Evaluate case with deterministic rule engine
      await caseApi.evaluateCase(newCase.id)

      // 3. Navigate to verdict page
      navigate(`/cases/${newCase.id}/verdict`)
    } catch (err: any) {
      console.error('Failed to process case:', err)
      const msg = err.response?.data?.message || 'Failed to submit case assessment. Please check fields or connection.'
      setError(msg)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6 py-6 max-w-5xl mx-auto px-4">
      {error && (
        <div className="bg-red-50 border border-red-300 text-red-900 text-sm p-4 rounded-xl flex items-start gap-3 shadow-xs">
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          <div>
            <strong className="font-semibold block text-red-950 mb-0.5">Submission Error</strong>
            <span>{error}</span>
          </div>
        </div>
      )}

      <CaseFormStepper onSubmit={handleCreateAndEvaluate} isLoading={isLoading} />
    </div>
  )
}
