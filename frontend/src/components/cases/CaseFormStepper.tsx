import React, { useState, useEffect } from 'react'
import type { CreateCaseRequest } from '../../types/api'
import { Input } from '../ui/Input'
import { Select } from '../ui/Select'
import { DisclaimerStrip } from '../ui/DisclaimerStrip'
import { Check, ArrowRight, ArrowLeft, Save, RotateCcw } from 'lucide-react'

interface CaseFormStepperProps {
  onSubmit: (data: CreateCaseRequest) => Promise<void>
  isLoading?: boolean
}

const DRAFT_KEY = 'bail_reckoner_draft_case'

const initialFormState: CreateCaseRequest = {
  caseNumber: '',
  firNumber: '',
  policeStation: '',
  offenceSection: '379',
  offenceType: 'Theft',
  maximumSentenceYears: 3,
  custodyStartDate: new Date().toISOString().split('T')[0],
  firstTimeOffender: true,
  residentialStability: true,
  employmentStatus: 'EMPLOYED',
  dependents: 1,
  previousCourtAppearances: 0,
  previousAbsconding: false,
  witnessTampering: false,
  coAccused: false,
  evidenceType: 'DOCUMENTARY',
  caseStage: 'UNDER_INVESTIGATION',
  suretyAvailable: true,
  bondReady: true,
  identificationReady: true,
}

export const CaseFormStepper: React.FC<CaseFormStepperProps> = ({ onSubmit, isLoading = false }) => {
  const [currentStep, setCurrentStep] = useState<number>(1)
  const [formData, setFormData] = useState<CreateCaseRequest>(() => {
    const saved = localStorage.getItem(DRAFT_KEY)
    if (saved) {
      try {
        return JSON.parse(saved)
      } catch (e) {
        return initialFormState
      }
    }
    return initialFormState
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [draftSavedToast, setDraftSavedToast] = useState(false)

  useEffect(() => {
    localStorage.setItem(DRAFT_KEY, JSON.stringify(formData))
  }, [formData])

  const handleInputChange = (field: keyof CreateCaseRequest, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }))
    }
  }

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {}
    if (step === 1) {
      if (!formData.caseNumber?.trim()) newErrors.caseNumber = 'Case number / CNR is required'
      if (!formData.offenceSection?.trim()) newErrors.offenceSection = 'Offence section is required'
    }
    if (step === 2) {
      if (!formData.custodyStartDate) newErrors.custodyStartDate = 'Custody start date is required'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, 5))
    }
  }

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1))
  }

  const handleManualSave = () => {
    localStorage.setItem(DRAFT_KEY, JSON.stringify(formData))
    setDraftSavedToast(true)
    setTimeout(() => setDraftSavedToast(false), 3000)
  }

  const handleResetDraft = () => {
    if (confirm('Are you sure you want to reset all entered form data?')) {
      localStorage.removeItem(DRAFT_KEY)
      setFormData(initialFormState)
      setCurrentStep(1)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateStep(currentStep)) return
    await onSubmit(formData)
    localStorage.removeItem(DRAFT_KEY)
  }

  const steps = [
    { number: 1, title: '1. Charges' },
    { number: 2, title: '2. Custody' },
    { number: 3, title: '3. Personal Ties' },
    { number: 4, title: '4. Evidence Risk' },
    { number: 5, title: '5. Review' },
  ]

  return (
    <div className="bg-white border border-[#EBE5F5] rounded-3xl p-6 md:p-8 shadow-sm space-y-8 max-w-4xl mx-auto">
      {/* Stepper Header Progress */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl md:text-2xl font-bold text-[#1F1D36]">
            Bail Eligibility Case Assessment Form
          </h2>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleManualSave}
              className="text-xs text-[#403D88] hover:underline flex items-center gap-1 font-bold cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" /> Save Draft
            </button>
            <span className="text-[#EBE5F5]">|</span>
            <button
              type="button"
              onClick={handleResetDraft}
              className="text-xs text-[#6B6888] hover:text-red-600 flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Reset
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="grid grid-cols-5 gap-2">
          {steps.map((step) => {
            const isActive = step.number === currentStep
            const isCompleted = step.number < currentStep
            return (
              <div key={step.number} className="space-y-1.5">
                <div
                  className={`h-2 rounded-full transition-all ${
                    isCompleted
                      ? 'bg-gradient-to-r from-[#F8B2B2] via-[#AF719D] to-[#8B639B]'
                      : isActive
                      ? 'bg-[#403D88]'
                      : 'bg-[#EBE5F5]'
                  }`}
                />
                <span
                  className={`text-[11px] font-semibold block text-center truncate ${
                    isActive ? 'text-[#403D88] font-bold' : 'text-[#6B6888]'
                  }`}
                >
                  {step.title}
                </span>
              </div>
            )
          })}
        </div>
      </div>

      {draftSavedToast && (
        <div className="bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs p-3 rounded-2xl flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>Draft state safely preserved on local device.</span>
        </div>
      )}

      {/* Form Content */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* STEP 1: CHARGES */}
        {currentStep === 1 && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <h3 className="text-lg font-bold text-[#1F1D36] border-b border-[#EBE5F5] pb-2">
              Step 1: Statutory Charge Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Case Identifier / CNR Number *"
                placeholder="e.g. CASE-2026-101"
                value={formData.caseNumber}
                onChange={(e) => handleInputChange('caseNumber', e.target.value)}
                error={errors.caseNumber}
                required
              />
              <Input
                label="FIR Number"
                placeholder="e.g. FIR-102/2026"
                value={formData.firNumber || ''}
                onChange={(e) => handleInputChange('firNumber', e.target.value)}
              />
              <Input
                label="Police Station Jurisdiction"
                placeholder="e.g. Central Police Station"
                value={formData.policeStation || ''}
                onChange={(e) => handleInputChange('policeStation', e.target.value)}
              />
              <Input
                label="Offence Statutory Section (IPC / BNS) *"
                placeholder="e.g. 379 or 420 or 302"
                value={formData.offenceSection}
                onChange={(e) => handleInputChange('offenceSection', e.target.value)}
                error={errors.offenceSection}
                required
                helperText="Law section number used to check statutory bailability."
              />
              <Input
                label="Nature of Offence"
                placeholder="e.g. Theft, Fraud, Assault"
                value={formData.offenceType || ''}
                onChange={(e) => handleInputChange('offenceType', e.target.value)}
              />
              <Input
                type="number"
                label="Maximum Sentence (Years)"
                value={formData.maximumSentenceYears || 3}
                onChange={(e) => handleInputChange('maximumSentenceYears', parseInt(e.target.value) || 3)}
                min={1}
                max={20}
              />
            </div>
          </div>
        )}

        {/* STEP 2: CUSTODY */}
        {currentStep === 2 && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <h3 className="text-lg font-bold text-[#1F1D36] border-b border-[#EBE5F5] pb-2">
              Step 2: Under-trial Custody Period
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                type="date"
                label="Custody Arrest / Remand Start Date *"
                value={formData.custodyStartDate || ''}
                onChange={(e) => handleInputChange('custodyStartDate', e.target.value)}
                error={errors.custodyStartDate}
                required
                helperText="Used to calculate undertrial time-served thresholds under Sec 479 BNSS."
              />

              <Select
                label="First-Time Undertrial Prisoner?"
                value={formData.firstTimeOffender ? 'true' : 'false'}
                onChange={(e) => handleInputChange('firstTimeOffender', e.target.value === 'true')}
                options={[
                  { value: 'true', label: 'Yes - First Time Undertrial (Eligible at 1/3rd sentence)' },
                  { value: 'false', label: 'No - Prior Criminal Record (Eligible at 1/2nd sentence)' },
                ]}
              />
            </div>
          </div>
        )}

        {/* STEP 3: PERSONAL TIES */}
        {currentStep === 3 && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <h3 className="text-lg font-bold text-[#1F1D36] border-b border-[#EBE5F5] pb-2">
              Step 3: Personal Ties & Flight Risk
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Select
                label="Permanent Residential Stability in Jurisdiction?"
                value={formData.residentialStability ? 'true' : 'false'}
                onChange={(e) => handleInputChange('residentialStability', e.target.value === 'true')}
                options={[
                  { value: 'true', label: 'Yes - Permanent Local Residence' },
                  { value: 'false', label: 'No - Transient / Non-Resident' },
                ]}
              />

              <Select
                label="Employment Status"
                value={formData.employmentStatus || 'EMPLOYED'}
                onChange={(e) => handleInputChange('employmentStatus', e.target.value)}
                options={[
                  { value: 'EMPLOYED', label: 'Employed / Self-Employed' },
                  { value: 'UNEMPLOYED', label: 'Unemployed' },
                  { value: 'STUDENT', label: 'Student' },
                ]}
              />

              <Input
                type="number"
                label="Number of Financial Dependents"
                value={formData.dependents || 0}
                onChange={(e) => handleInputChange('dependents', parseInt(e.target.value) || 0)}
                min={0}
              />

              <Input
                type="number"
                label="Previous Court Appearances Attended"
                value={formData.previousCourtAppearances || 0}
                onChange={(e) => handleInputChange('previousCourtAppearances', parseInt(e.target.value) || 0)}
                min={0}
              />

              <Select
                label="History of Absconding or Bail Default?"
                value={formData.previousAbsconding ? 'true' : 'false'}
                onChange={(e) => handleInputChange('previousAbsconding', e.target.value === 'true')}
                options={[
                  { value: 'false', label: 'No - Never absconded' },
                  { value: 'true', label: 'Yes - Prior absconding record (+40 flight risk)' },
                ]}
              />
            </div>
          </div>
        )}

        {/* STEP 4: EVIDENCE RISK & PROCEDURAL */}
        {currentStep === 4 && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <h3 className="text-lg font-bold text-[#1F1D36] border-b border-[#EBE5F5] pb-2">
              Step 4: Evidence Tampering Risk & Procedural Readiness
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Select
                label="Witness Tampering Risk / Allegation?"
                value={formData.witnessTampering ? 'true' : 'false'}
                onChange={(e) => handleInputChange('witnessTampering', e.target.value === 'true')}
                options={[
                  { value: 'false', label: 'No - No tampering risk' },
                  { value: 'true', label: 'Yes - Allegation of witness tampering' },
                ]}
              />

              <Select
                label="Co-Accused Granted Bail?"
                value={formData.coAccused ? 'true' : 'false'}
                onChange={(e) => handleInputChange('coAccused', e.target.value === 'true')}
                options={[
                  { value: 'false', label: 'No / Not applicable' },
                  { value: 'true', label: 'Yes - Co-accused exists' },
                ]}
              />

              <Select
                label="Primary Nature of Evidence"
                value={formData.evidenceType || 'DOCUMENTARY'}
                onChange={(e) => handleInputChange('evidenceType', e.target.value)}
                options={[
                  { value: 'DOCUMENTARY', label: 'Documentary Evidence' },
                  { value: 'PHYSICAL', label: 'Physical Evidence' },
                  { value: 'FORENSIC', label: 'Forensic Evidence' },
                  { value: 'ORAL', label: 'Oral Witness Testimony' },
                ]}
              />

              <Select
                label="Surety Available?"
                value={formData.suretyAvailable ? 'true' : 'false'}
                onChange={(e) => handleInputChange('suretyAvailable', e.target.value === 'true')}
                options={[
                  { value: 'true', label: 'Yes - Local Surety Available' },
                  { value: 'false', label: 'No Surety Yet' },
                ]}
              />

              <Select
                label="Bail Bond Papers Prepared?"
                value={formData.bondReady ? 'true' : 'false'}
                onChange={(e) => handleInputChange('bondReady', e.target.value === 'true')}
                options={[
                  { value: 'true', label: 'Yes - Bond Ready' },
                  { value: 'false', label: 'Pending Bond Preparation' },
                ]}
              />

              <Select
                label="Aadhaar / ID Verification Documents Ready?"
                value={formData.identificationReady ? 'true' : 'false'}
                onChange={(e) => handleInputChange('identificationReady', e.target.value === 'true')}
                options={[
                  { value: 'true', label: 'Yes - Verified ID Ready' },
                  { value: 'false', label: 'Pending ID Verification' },
                ]}
              />
            </div>
          </div>
        )}

        {/* STEP 5: REVIEW */}
        {currentStep === 5 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <h3 className="text-lg font-bold text-[#1F1D36] border-b border-[#EBE5F5] pb-2">
              Step 5: Review Assessment Input
            </h3>

            <div className="bg-[#F8F7FC] border border-[#EBE5F5] rounded-2xl p-4 text-xs md:text-sm space-y-3">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                <div><span className="text-[#6B6888] block">Case Number:</span><strong>{formData.caseNumber}</strong></div>
                <div><span className="text-[#6B6888] block">FIR Number:</span><strong>{formData.firNumber || 'N/A'}</strong></div>
                <div><span className="text-[#6B6888] block">Section:</span><strong>{formData.offenceSection}</strong></div>
                <div><span className="text-[#6B6888] block">Custody Date:</span><strong>{formData.custodyStartDate}</strong></div>
                <div><span className="text-[#6B6888] block">First Time Prisoner:</span><strong>{formData.firstTimeOffender ? 'Yes' : 'No'}</strong></div>
                <div><span className="text-[#6B6888] block">Employment:</span><strong>{formData.employmentStatus}</strong></div>
              </div>
            </div>

            <DisclaimerStrip />
          </div>
        )}

        {/* Navigation Control Buttons */}
        <div className="flex items-center justify-between pt-4 border-t border-[#EBE5F5]">
          {currentStep > 1 ? (
            <button
              type="button"
              onClick={handleBack}
              disabled={isLoading}
              className="px-5 py-2.5 rounded-xl border border-[#EBE5F5] bg-white text-[#1F1D36] hover:bg-[#F8F7FC] text-xs font-bold transition-all flex items-center gap-2 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
          ) : (
            <div />
          )}

          {currentStep < 5 ? (
            <button
              type="button"
              onClick={handleNext}
              className="px-5 py-2.5 rounded-xl bg-[#403D88] hover:bg-[#312E6B] text-white text-xs font-bold shadow-md transition-all flex items-center gap-2 cursor-pointer"
            >
              Next Step <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-3 rounded-2xl bg-gradient-to-r from-[#F8B2B2] via-[#AF719D] to-[#8B639B] hover:opacity-95 text-white text-xs font-extrabold shadow-lg transition-all flex items-center gap-2 cursor-pointer"
            >
              <Check className="w-5 h-5" /> Submit & Evaluate Verdict
            </button>
          )}
        </div>
      </form>
    </div>
  )
}
