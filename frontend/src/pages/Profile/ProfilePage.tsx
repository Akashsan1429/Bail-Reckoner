import React, { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useTranslation } from 'react-i18next'
import type { Role } from '../../types/api'
import {
  User,
  Shield,
  Building2,
  Mail,
  Calendar,
  CheckCircle2,
  Lock,
  RefreshCw,
  Award,
  FileCheck,
  PhoneCall,
  Briefcase,
} from 'lucide-react'

const ROLES_LIST: { role: Role; label: string; desc: string }[] = [
  { role: 'PRISONER_FAMILY', label: 'Family Member', desc: 'Case tracking, hearing dates, and legal aid' },
  { role: 'LAWYER', label: 'Defense Lawyer', desc: 'Precedent finder, client pleas, and legal briefs' },
  { role: 'NGO_ADMIN', label: 'NGO Administrator', desc: 'Bail bond funding and pro-bono advocate allocation' },
  { role: 'COURT_STAFF', label: 'Court Staff', desc: 'Judicial docket review and order logging' },
  { role: 'ADMIN', label: 'System Admin', desc: 'Full platform administration and rule engine config' },
]

export const ProfilePage: React.FC = () => {
  const { t } = useTranslation()
  const { user } = useAuth()
  const [selectedRole, setSelectedRole] = useState<Role>(user?.role || 'PRISONER_FAMILY')
  const [saveSuccess, setSaveSuccess] = useState(false)

  const handleSwitchRole = (role: Role) => {
    if (!user) return
    const updatedUser = { ...user, role }
    localStorage.setItem('bail_reckoner_user', JSON.stringify(updatedUser))
    setSelectedRole(role)
    setSaveSuccess(true)
    setTimeout(() => {
      window.location.href = '/dashboard'
    }, 600)
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Header Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#403D88] via-[#8B639B] to-[#AF719D] p-8 text-white shadow-lg">
        <div className="flex flex-col md:flex-row items-center md:items-end justify-between gap-6 relative z-10">
          <div className="flex flex-col md:flex-row items-center gap-5">
            <div className="w-20 h-20 rounded-full bg-white text-[#403D88] flex items-center justify-center font-extrabold text-2xl shadow-md border-4 border-white/20">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div className="text-center md:text-left space-y-1">
              <h1 className="text-2xl md:text-3xl font-extrabold">{user?.name || 'Rahul Sharma'}</h1>
              <p className="text-xs md:text-sm text-[#F8B2B2] font-semibold flex items-center justify-center md:justify-start gap-1.5">
                <Shield className="w-4 h-4" />
                <span>{user?.role ? t(`roles.${user.role}`, { defaultValue: user.role.replace('_', ' ') }) : 'Family Member'}</span>
              </p>
              <p className="text-xs text-white/80">{user?.email}</p>
            </div>
          </div>

          <div className="px-4 py-2 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-xs font-mono font-bold">
            Account ID: #BR-USER-8921
          </div>
        </div>
      </div>

      {saveSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-800 text-xs font-bold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          Persona role updated successfully! Redirecting to customized dashboard...
        </div>
      )}

      {/* Role-Specific Profile Content */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Column: Role Information */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-[#EBE5F5] shadow-sm space-y-5">
            <h2 className="text-base font-bold text-[#1F1D36] flex items-center gap-2">
              <User className="w-5 h-5 text-[#403D88]" /> User Information & Credentials
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-2xl bg-[#F8F7FC] border border-[#EBE5F5] space-y-1">
                <span className="text-[#6B6888] font-medium flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-[#8B639B]" /> Full Name
                </span>
                <p className="font-bold text-[#1F1D36] text-sm">{user?.name}</p>
              </div>

              <div className="p-4 rounded-2xl bg-[#F8F7FC] border border-[#EBE5F5] space-y-1">
                <span className="text-[#6B6888] font-medium flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-[#8B639B]" /> Email Address
                </span>
                <p className="font-bold text-[#1F1D36] text-sm">{user?.email}</p>
              </div>

              <div className="p-4 rounded-2xl bg-[#F8F7FC] border border-[#EBE5F5] space-y-1">
                <span className="text-[#6B6888] font-medium flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-[#8B639B]" /> Organization
                </span>
                <p className="font-bold text-[#1F1D36] text-sm">{user?.organizationName || 'Legal Aid Services India'}</p>
              </div>

              <div className="p-4 rounded-2xl bg-[#F8F7FC] border border-[#EBE5F5] space-y-1">
                <span className="text-[#6B6888] font-medium flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-[#8B639B]" /> Account Created
                </span>
                <p className="font-bold text-[#1F1D36] text-sm">May 10, 2025</p>
              </div>
            </div>

            {/* Custom Credentials based on Role */}
            <div className="pt-4 border-t border-[#EBE5F5] space-y-3">
              <h3 className="text-xs font-bold text-[#1F1D36] uppercase tracking-wider text-[#403D88]">
                Role Credentials & Verification
              </h3>

              {user?.role === 'LAWYER' && (
                <div className="p-4 rounded-2xl bg-[#403D88]/5 border border-[#403D88]/20 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[#403D88] flex items-center gap-1.5">
                      <Award className="w-4 h-4 text-[#8B639B]" /> Bar Council License No.
                    </span>
                    <span className="font-mono font-bold text-[#1F1D36]">D/1842/2018</span>
                  </div>
                  <div className="flex items-center justify-between text-[#6B6888]">
                    <span>Jurisdiction: High Court of Delhi</span>
                    <span className="text-emerald-600 font-bold">Verified Practitioner</span>
                  </div>
                </div>
              )}

              {user?.role === 'NGO_ADMIN' && (
                <div className="p-4 rounded-2xl bg-[#AF719D]/10 border border-[#AF719D]/20 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[#8B639B] flex items-center gap-1.5">
                      <FileCheck className="w-4 h-4" /> NGO Reg. Certificate
                    </span>
                    <span className="font-mono font-bold text-[#1F1D36]">NGO-DL-9821-2021</span>
                  </div>
                  <div className="flex items-center justify-between text-[#6B6888]">
                    <span>Legal Aid Panel Status: Active</span>
                    <span className="text-emerald-600 font-bold">Approved Partner</span>
                  </div>
                </div>
              )}

              {user?.role === 'COURT_STAFF' && (
                <div className="p-4 rounded-2xl bg-[#8B639B]/10 border border-[#8B639B]/20 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[#403D88] flex items-center gap-1.5">
                      <Briefcase className="w-4 h-4" /> Judicial Office Badge ID
                    </span>
                    <span className="font-mono font-bold text-[#1F1D36]">COURT-STAFF-0042</span>
                  </div>
                  <div className="flex items-center justify-between text-[#6B6888]">
                    <span>Court Registry: District Court Bench 4</span>
                    <span className="text-emerald-600 font-bold">Authenticated</span>
                  </div>
                </div>
              )}

              {user?.role === 'PRISONER_FAMILY' && (
                <div className="p-4 rounded-2xl bg-[#F8B2B2]/20 border border-[#AF719D]/30 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[#403D88] flex items-center gap-1.5">
                      <PhoneCall className="w-4 h-4 text-[#8B639B]" /> Legal Aid Case Helpline
                    </span>
                    <span className="font-bold text-[#403D88]">1800-11-4040</span>
                  </div>
                  <p className="text-[11px] text-[#6B6888]">
                    You are currently using the family member assistance portal for undertrial eligibility checks.
                  </p>
                </div>
              )}

              {user?.role === 'ADMIN' && (
                <div className="p-4 rounded-2xl bg-purple-500/10 border border-purple-500/30 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-purple-900 flex items-center gap-1.5">
                      <Lock className="w-4 h-4 text-purple-700" /> System Root Privileges
                    </span>
                    <span className="font-mono font-bold text-purple-900">SUPERUSER</span>
                  </div>
                  <p className="text-[11px] text-purple-800">
                    Full access to user management, rule engine configurations, and audit telemetry.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Interactive Role Persona Switcher */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-[#EBE5F5] shadow-sm space-y-4">
            <h2 className="text-base font-bold text-[#1F1D36] flex items-center gap-2">
              <RefreshCw className="w-5 h-5 text-[#8B639B]" /> Switch Active Persona Role
            </h2>
            <p className="text-xs text-[#6B6888]">
              Select a persona role below to instantly switch your dashboard view:
            </p>

            <div className="space-y-2.5">
              {ROLES_LIST.map((r) => {
                const isSelected = selectedRole === r.role
                return (
                  <button
                    key={r.role}
                    onClick={() => handleSwitchRole(r.role)}
                    className={`w-full text-left p-3.5 rounded-2xl border transition-all flex items-center justify-between cursor-pointer ${
                      isSelected
                        ? 'bg-gradient-to-r from-[#F8B2B2]/30 via-[#AF719D]/20 to-[#8B639B]/20 border-[#403D88] shadow-sm'
                        : 'bg-[#F8F7FC] border-[#EBE5F5] hover:border-[#8B639B]/40'
                    }`}
                  >
                    <div>
                      <span className="text-xs font-bold text-[#1F1D36] block">{r.label}</span>
                      <span className="text-[10px] text-[#6B6888] line-clamp-1">{r.desc}</span>
                    </div>
                    {isSelected && <CheckCircle2 className="w-4 h-4 text-[#403D88] shrink-0" />}
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
