import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Scale, BookOpen, ArrowRight, CheckCircle2, AlertTriangle } from 'lucide-react'
import { Button } from '../../components/ui/Button'
import { DisclaimerStrip } from '../../components/ui/DisclaimerStrip'
import { useAuth } from '../../context/AuthContext'

export const LandingPage: React.FC = () => {
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()

  return (
    <div className="space-y-16 py-8 md:py-12">
      {/* Hero Section */}
      <section className="max-w-5xl mx-auto px-4 text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-accent/30 bg-surface-light text-accent text-xs font-semibold font-mono">
          <Scale className="w-4 h-4" /> Indian Statutory Decision Support System
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-ink leading-tight tracking-tight">
          Transparent Bail Eligibility Assessment for Undertrial Prisoners
        </h1>

        <p className="text-base sm:text-lg text-ink-muted max-w-3xl mx-auto leading-relaxed font-sans">
          Bail Reckoner assists legal-aid lawyers, undertrial prisoners, families, and courts in calculating undertrial custody duration and bailability under Indian statutory provisions (IPC, BNS, CrPC, BNSS).
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
          <Button
            size="lg"
            onClick={() => navigate(isAuthenticated ? '/cases/new' : '/login')}
            className="w-full sm:w-auto shadow-md"
          >
            Start Eligibility Check <ArrowRight className="w-5 h-5 ml-2" />
          </Button>

          <Button
            variant="outline"
            size="lg"
            onClick={() => navigate('/laws')}
            className="w-full sm:w-auto"
          >
            <BookOpen className="w-5 h-5 mr-2" /> Explore Law Library
          </Button>
        </div>

        <DisclaimerStrip className="max-w-3xl mx-auto text-left mt-6" />
      </section>

      {/* Feature Grid: What Bail Reckoner Does vs Does NOT Do */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* WHAT IT DOES */}
          <div className="bg-white border-2 border-surface-deep rounded-2xl p-6 md:p-8 space-y-4 shadow-sm">
            <div className="flex items-center gap-3 text-emerald-800 border-b border-surface-deep pb-4">
              <CheckCircle2 className="w-6 h-6 text-emerald-600" />
              <h2 className="text-xl font-serif font-bold text-ink">What Bail Reckoner Does</h2>
            </div>
            <ul className="space-y-3 text-sm text-ink-muted leading-relaxed">
              <li className="flex items-start gap-2">
                <span className="text-emerald-600 font-bold">•</span>
                <span><strong>Deterministic Assessment:</strong> Runs standard statutory rules (Sec 479 BNSS / 436A CrPC) to evaluate undertrial custody thresholds.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-600 font-bold">•</span>
                <span><strong>Risk Scoring:</strong> Computes flight risk and evidence tampering scores objectively without bias.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-600 font-bold">•</span>
                <span><strong>PDF Report Generation:</strong> Produces formatted decision-support reports containing full rule traces and legal citations.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-600 font-bold">•</span>
                <span><strong>Grounded AI Assistance:</strong> Answers legal section queries using verified statutory context from MySQL database.</span>
              </li>
            </ul>
          </div>

          {/* WHAT IT DOES NOT DO */}
          <div className="bg-white border-2 border-surface-deep rounded-2xl p-6 md:p-8 space-y-4 shadow-sm">
            <div className="flex items-center gap-3 text-amber-900 border-b border-surface-deep pb-4">
              <AlertTriangle className="w-6 h-6 text-amber-600" />
              <h2 className="text-xl font-serif font-bold text-ink">What Bail Reckoner Does NOT Do</h2>
            </div>
            <ul className="space-y-3 text-sm text-ink-muted leading-relaxed">
              <li className="flex items-start gap-2">
                <span className="text-amber-600 font-bold">•</span>
                <span><strong>Does NOT replace courts:</strong> It does NOT issue judicial orders, guarantees, or court judgments.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-600 font-bold">•</span>
                <span><strong>AI does NOT decide eligibility:</strong> The AI chatbot is an explanation layer and never decides actual bail outcomes.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-600 font-bold">•</span>
                <span><strong>Does NOT replace legal counsel:</strong> It provides structured decision support to empower legal aid counsel and families.</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Target User Roles Section */}
      <section className="bg-surface-light/50 border-y border-surface-deep py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-2xl md:text-3xl font-serif font-bold text-ink">
              Designed for Public Legal Aid Stakeholders
            </h2>
            <p className="text-sm text-ink-muted">
              Tailored interfaces for every role in the undertrial legal aid ecosystem.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white border border-surface-deep p-5 rounded-xl space-y-2 shadow-xs">
              <span className="text-xs font-mono font-bold text-accent uppercase">Role 1</span>
              <h3 className="font-serif font-semibold text-base text-ink">Prisoners & Families</h3>
              <p className="text-xs text-ink-muted leading-relaxed">
                Simple multilingual eligibility checks to understand custody duration and bailability rights.
              </p>
            </div>

            <div className="bg-white border border-surface-deep p-5 rounded-xl space-y-2 shadow-xs">
              <span className="text-xs font-mono font-bold text-accent uppercase">Role 2</span>
              <h3 className="font-serif font-semibold text-base text-ink">Legal-Aid Counsel</h3>
              <p className="text-xs text-ink-muted leading-relaxed">
                Caseload management, rule trace documentation, and downloadable court PDF reports.
              </p>
            </div>

            <div className="bg-white border border-surface-deep p-5 rounded-xl space-y-2 shadow-xs">
              <span className="text-xs font-mono font-bold text-accent uppercase">Role 3</span>
              <h3 className="font-serif font-semibold text-base text-ink">NGO Volunteers</h3>
              <p className="text-xs text-ink-muted leading-relaxed">
                Under-trial prisoner tracking, procedural verification, and legal aid coordination.
              </p>
            </div>

            <div className="bg-white border border-surface-deep p-5 rounded-xl space-y-2 shadow-xs">
              <span className="text-xs font-mono font-bold text-accent uppercase">Role 4</span>
              <h3 className="font-serif font-semibold text-base text-ink">Court Administrators</h3>
              <p className="text-xs text-ink-muted leading-relaxed">
                Statutory law section repository management and audit log review.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
