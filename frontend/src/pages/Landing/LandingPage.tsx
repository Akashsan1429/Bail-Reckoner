import React from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Scale, BookOpen, ArrowRight, CheckCircle2, AlertTriangle, ShieldCheck, Users, Briefcase, Building2 } from 'lucide-react'
import { DisclaimerStrip } from '../../components/ui/DisclaimerStrip'
import { useAuth } from '../../context/AuthContext'

export const LandingPage: React.FC = () => {
  const { isAuthenticated, user } = useAuth()
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-[#F8F7FC] text-[#1F1D36] flex flex-col font-sans">
      {/* Landing Navbar */}
      <header className="bg-white/90 backdrop-blur-md border-b border-[#EBE5F5] sticky top-0 z-40">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#F8B2B2] via-[#AF719D] to-[#8B639B] p-0.5 shadow-md">
              <div className="w-full h-full bg-[#403D88] rounded-[14px] flex items-center justify-center">
                <Scale className="w-5 h-5 text-[#F8B2B2]" />
              </div>
            </div>
            <div>
              <span className="font-bold text-base md:text-lg text-[#1F1D36] block leading-tight">
                Bail Reckoner
              </span>
              <span className="text-[10px] font-semibold text-[#6B6888] tracking-wider block">
                Digital Legal Aid System
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <button
                onClick={() => navigate('/dashboard')}
                className="px-5 py-2.5 rounded-xl bg-[#403D88] text-white text-xs font-bold hover:bg-[#312E6B] transition-all cursor-pointer shadow-md flex items-center gap-2"
              >
                <span>Go to Dashboard ({user?.role ? user.role.replace('_', ' ').toLowerCase() : 'user'})</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-4 py-2 text-xs font-bold text-[#403D88] hover:bg-[#FAF7FC] rounded-xl transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-5 py-2.5 rounded-xl bg-[#403D88] text-white text-xs font-bold hover:bg-[#312E6B] transition-all shadow-md"
                >
                  Register Portal
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1 space-y-16 py-10 md:py-16">
        {/* Hero Section */}
        <section className="max-w-5xl mx-auto px-4 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#8B639B]/30 bg-white text-[#403D88] text-xs font-bold shadow-2xs">
            <Scale className="w-4 h-4 text-[#8B639B]" /> Indian Statutory Decision Support System
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#1F1D36] leading-tight tracking-tight">
            Transparent Undertrial Bail Eligibility & Decision Support
          </h1>

          <p className="text-base sm:text-lg text-[#6B6888] max-w-3xl mx-auto leading-relaxed">
            Bail Reckoner assists legal-aid lawyers, undertrial prisoners, families, NGOs, and judicial staff in evaluating custody duration and bailability under Indian statutory provisions (IPC, BNS, CrPC, BNSS 2023).
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <button
              onClick={() => navigate(isAuthenticated ? '/cases/new' : '/login')}
              className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-[#F8B2B2] via-[#AF719D] to-[#8B639B] hover:opacity-95 text-white text-sm font-extrabold shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Start Eligibility Check</span>
              <ArrowRight className="w-5 h-5" />
            </button>

            <button
              onClick={() => navigate('/laws')}
              className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-white border border-[#EBE5F5] hover:bg-[#F8F7FC] text-[#403D88] text-sm font-bold shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <BookOpen className="w-5 h-5 text-[#8B639B]" />
              <span>Explore Statutory Law Library</span>
            </button>
          </div>

          <DisclaimerStrip className="max-w-3xl mx-auto text-left mt-6" />
        </section>

        {/* Feature Grid: What Bail Reckoner Does vs Does NOT Do */}
        <section className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* WHAT IT DOES */}
            <div className="bg-white border border-[#EBE5F5] rounded-3xl p-6 md:p-8 space-y-4 shadow-sm">
              <div className="flex items-center gap-3 text-emerald-800 border-b border-[#EBE5F5] pb-4">
                <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                <h2 className="text-xl font-bold text-[#1F1D36]">What Bail Reckoner Does</h2>
              </div>
              <ul className="space-y-3 text-xs md:text-sm text-[#6B6888] leading-relaxed">
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600 font-bold">•</span>
                  <span><strong>Deterministic Assessment:</strong> Runs statutory rules (Sec 479 BNSS / 436A CrPC) to evaluate undertrial custody thresholds.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600 font-bold">•</span>
                  <span><strong>Risk Scoring:</strong> Computes flight risk and evidence tampering scores objectively without bias.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600 font-bold">•</span>
                  <span><strong>Rule Trace Logs:</strong> Produces formatted decision-support reports containing full rule traces and legal citations.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600 font-bold">•</span>
                  <span><strong>Grounded AI Assistance:</strong> Answers legal section queries using verified statutory context from backend repository.</span>
                </li>
              </ul>
            </div>

            {/* WHAT IT DOES NOT DO */}
            <div className="bg-white border border-[#EBE5F5] rounded-3xl p-6 md:p-8 space-y-4 shadow-sm">
              <div className="flex items-center gap-3 text-amber-900 border-b border-[#EBE5F5] pb-4">
                <AlertTriangle className="w-6 h-6 text-amber-600" />
                <h2 className="text-xl font-bold text-[#1F1D36]">What Bail Reckoner Does NOT Do</h2>
              </div>
              <ul className="space-y-3 text-xs md:text-sm text-[#6B6888] leading-relaxed">
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
        <section className="bg-white border-y border-[#EBE5F5] py-12">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
            <div className="text-center space-y-2">
              <h2 className="text-2xl md:text-3xl font-bold text-[#1F1D36]">
                Designed for 5 Legal Aid Stakeholders
              </h2>
              <p className="text-xs md:text-sm text-[#6B6888]">
                Tailored dashboards for every role in the undertrial legal aid ecosystem.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-[#F8F7FC] border border-[#EBE5F5] p-6 rounded-3xl space-y-3">
                <ShieldCheck className="w-6 h-6 text-[#403D88]" />
                <h3 className="font-bold text-base text-[#1F1D36]">Prisoner Families</h3>
                <p className="text-xs text-[#6B6888] leading-relaxed">
                  Simple multilingual eligibility checks to understand custody duration and bailability rights.
                </p>
              </div>

              <div className="bg-[#F8F7FC] border border-[#EBE5F5] p-6 rounded-3xl space-y-3">
                <Briefcase className="w-6 h-6 text-[#8B639B]" />
                <h3 className="font-bold text-base text-[#1F1D36]">Defense Lawyers</h3>
                <p className="text-xs text-[#6B6888] leading-relaxed">
                  Caseload management, rule trace documentation, and downloadable precedent briefs.
                </p>
              </div>

              <div className="bg-[#F8F7FC] border border-[#EBE5F5] p-6 rounded-3xl space-y-3">
                <Users className="w-6 h-6 text-[#AF719D]" />
                <h3 className="font-bold text-base text-[#1F1D36]">NGO Advocates</h3>
                <p className="text-xs text-[#6B6888] leading-relaxed">
                  Under-trial prisoner tracking, procedural verification, and bail bond allocation.
                </p>
              </div>

              <div className="bg-[#F8F7FC] border border-[#EBE5F5] p-6 rounded-3xl space-y-3">
                <Building2 className="w-6 h-6 text-[#403D88]" />
                <h3 className="font-bold text-base text-[#1F1D36]">Court Registry</h3>
                <p className="text-xs text-[#6B6888] leading-relaxed">
                  Statutory law section repository management, docket verification, and audit logs.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
