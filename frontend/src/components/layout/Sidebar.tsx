import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useTranslation } from 'react-i18next'
import type { Role } from '../../types/api'
import {
  Scale,
  LayoutDashboard,
  FolderKanban,
  CheckSquare,
  Clock,
  Sparkles,
  BookOpen,
  Newspaper,
  Download,
  User,
  Settings,
  HelpCircle,
  LogOut,
  ChevronUp,
  X,
  ShieldAlert,
} from 'lucide-react'

interface SidebarProps {
  onOpenChat: () => void
  isOpenMobile?: boolean
  onCloseMobile?: () => void
}

const ROLES_LIST: { role: Role; label: string; description: string }[] = [
  { role: 'PRISONER_FAMILY', label: 'Family Member', description: 'Simplified eligibility check & case tracking' },
  { role: 'LAWYER', label: 'Defense Lawyer', description: 'Legal briefs, precedent search & court prep' },
  { role: 'NGO_ADMIN', label: 'NGO Administrator', description: 'Humanitarian bail fund & advocate allocation' },
  { role: 'COURT_STAFF', label: 'Court Staff', description: 'Judicial docket review & rule trace audit' },
  { role: 'ADMIN', label: 'System Admin', description: 'Full system management & rule engine config' },
]

export const Sidebar: React.FC<SidebarProps> = ({ onOpenChat, isOpenMobile, onCloseMobile }) => {
  const { t } = useTranslation()
  const { user, logout } = useAuth()
  const location = useLocation()
  const [isRoleMenuOpen, setIsRoleMenuOpen] = useState(false)

  const isActive = (path: string) => location.pathname === path

  const handleRoleSwitch = (newRole: Role) => {
    if (!user) return
    const updatedUser = { ...user, role: newRole }
    localStorage.setItem('bail_reckoner_user', JSON.stringify(updatedUser))
    setIsRoleMenuOpen(false)
    window.location.reload()
  }

  const mainLinks = [
    { path: '/dashboard', label: t('nav.dashboard', { defaultValue: 'Dashboard' }), icon: <LayoutDashboard className="w-5 h-5" /> },
    { path: '/cases', label: t('nav.cases', { defaultValue: 'My Cases' }), icon: <FolderKanban className="w-5 h-5" /> },
    { path: '/cases/new', label: t('nav.newCase', { defaultValue: 'New Case Check' }), icon: <CheckSquare className="w-5 h-5" /> },
    { path: '/cases', label: 'Case History', icon: <Clock className="w-5 h-5" /> },
    { action: onOpenChat, label: 'AI Legal Assistant', icon: <Sparkles className="w-5 h-5 text-amber-300" /> },
  ]

  const resourceLinks = [
    { path: '/laws', label: 'Law Library', icon: <BookOpen className="w-5 h-5" /> },
    { path: '/laws', label: 'Legal Updates', icon: <Newspaper className="w-5 h-5" /> },
    { path: '/laws', label: 'Downloads', icon: <Download className="w-5 h-5" /> },
  ]

  const accountLinks = [
    { path: '/profile', label: 'Profile', icon: <User className="w-5 h-5" /> },
    { path: '/settings', label: 'Settings', icon: <Settings className="w-5 h-5" /> },
    { path: '/help', label: 'Help & Support', icon: <HelpCircle className="w-5 h-5" /> },
  ]

  const sidebarContent = (
    <div className="flex flex-col h-full bg-[#403D88] text-white selection:bg-[#F8B2B2]/30 selection:text-white">
      {/* Brand Header */}
      <div className="p-6 border-b border-white/10 flex items-center justify-between">
        <Link to="/dashboard" className="flex items-center gap-3.5 group">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-[#F8B2B2] via-[#AF719D] to-[#8B639B] p-0.5 shadow-lg shadow-black/20 group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-[#403D88] rounded-[14px] flex items-center justify-center">
              <Scale className="w-6 h-6 text-[#F8B2B2]" />
            </div>
          </div>
          <div>
            <h1 className="font-bold text-lg text-white tracking-tight leading-tight flex items-center gap-1.5">
              Bail Reckoner
            </h1>
            <p className="text-[11px] text-[#F8B2B2]/80 font-medium tracking-wide">
              Legal Aid. Empowering Justice.
            </p>
          </div>
        </Link>
        {isOpenMobile && (
          <button
            onClick={onCloseMobile}
            className="p-1.5 text-white/70 hover:text-white rounded-lg hover:bg-white/10 transition-colors md:hidden"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Navigation Links Scroll Area */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-7 custom-scrollbar">
        {/* MAIN SECTION */}
        <div>
          <span className="px-3 text-[10px] font-bold text-[#F8B2B2]/70 uppercase tracking-widest block mb-3 font-mono">
            MAIN
          </span>
          <nav className="space-y-1.5">
            {mainLinks.map((item, idx) => {
              if (item.action) {
                return (
                  <button
                    key={`main-action-${idx}`}
                    onClick={() => {
                      item.action()
                      if (onCloseMobile) onCloseMobile()
                    }}
                    className="w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-xs md:text-sm font-medium text-white/80 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </button>
                )
              }
              const active = isActive(item.path!)
              return (
                <Link
                  key={`main-${idx}-${item.path}`}
                  to={item.path!}
                  onClick={() => {
                    if (onCloseMobile) onCloseMobile()
                  }}
                  className={`flex items-center gap-3 px-3.5 py-3 rounded-xl text-xs md:text-sm font-medium transition-all ${
                    active
                      ? 'bg-gradient-to-r from-[#F8B2B2] via-[#AF719D] to-[#8B639B] text-white font-semibold shadow-lg shadow-black/20'
                      : 'text-white/85 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              )
            })}
          </nav>
        </div>

        {/* RESOURCES SECTION */}
        <div>
          <span className="px-3 text-[10px] font-bold text-[#F8B2B2]/70 uppercase tracking-widest block mb-3 font-mono">
            RESOURCES
          </span>
          <nav className="space-y-1.5">
            {resourceLinks.map((item, idx) => {
              const active = isActive(item.path)
              return (
                <Link
                  key={`res-${idx}`}
                  to={item.path}
                  onClick={() => {
                    if (onCloseMobile) onCloseMobile()
                  }}
                  className={`flex items-center gap-3 px-3.5 py-3 rounded-xl text-xs md:text-sm font-medium transition-all ${
                    active
                      ? 'bg-white/15 text-white font-semibold'
                      : 'text-white/80 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              )
            })}
          </nav>
        </div>

        {/* ACCOUNT SECTION */}
        <div>
          <span className="px-3 text-[10px] font-bold text-[#F8B2B2]/70 uppercase tracking-widest block mb-3 font-mono">
            ACCOUNT
          </span>
          <nav className="space-y-1.5">
            {accountLinks.map((item, idx) => {
              const active = isActive(item.path)
              return (
                <Link
                  key={`acc-${idx}`}
                  to={item.path}
                  onClick={() => {
                    if (onCloseMobile) onCloseMobile()
                  }}
                  className={`flex items-center gap-3 px-3.5 py-3 rounded-xl text-xs md:text-sm font-medium transition-all ${
                    active
                      ? 'bg-white/15 text-white font-semibold'
                      : 'text-white/80 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              )
            })}
          </nav>
        </div>
      </div>

      {/* Role Switcher Popover Overlay */}
      {isRoleMenuOpen && (
        <div className="p-4 mx-3 mb-2 bg-[#312E6B] border border-white/20 rounded-2xl shadow-2xl animate-in slide-in-from-bottom duration-200">
          <div className="flex items-center justify-between pb-2 border-b border-white/15 mb-2">
            <span className="text-xs font-bold text-[#F8B2B2] uppercase tracking-wider flex items-center gap-1.5">
              <ShieldAlert className="w-3.5 h-3.5" /> Select Persona Role
            </span>
            <button onClick={() => setIsRoleMenuOpen(false)} className="text-white/60 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="space-y-1 max-h-56 overflow-y-auto custom-scrollbar">
            {ROLES_LIST.map((r) => {
              const isCurrent = user?.role === r.role
              return (
                <button
                  key={r.role}
                  onClick={() => handleRoleSwitch(r.role)}
                  className={`w-full text-left p-2.5 rounded-xl transition-all ${
                    isCurrent
                      ? 'bg-gradient-to-r from-[#F8B2B2]/20 to-[#8B639B]/20 border border-[#F8B2B2]/40 text-white font-semibold'
                      : 'hover:bg-white/10 text-white/80 hover:text-white'
                  }`}
                >
                  <div className="text-xs font-bold">{r.label}</div>
                  <div className="text-[10px] text-white/60 line-clamp-1">{r.description}</div>
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* Footer User Profile & Role Switcher Widget */}
      <div className="p-4 border-t border-white/10 bg-[#312E6B]/50 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#F8B2B2] to-[#8B639B] flex items-center justify-center text-white font-bold text-sm shadow-md shrink-0">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-white truncate leading-tight">{user?.name || 'Rahul Sharma'}</p>
              <p className="text-[10px] text-[#F8B2B2] font-semibold truncate capitalize">
                {user?.role ? t(`roles.${user.role}`, { defaultValue: user.role.replace('_', ' ').toLowerCase() }) : 'Family Member'}
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsRoleMenuOpen(!isRoleMenuOpen)}
            className="p-1.5 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
            title="Switch Persona Role"
          >
            <ChevronUp className={`w-4 h-4 transition-transform ${isRoleMenuOpen ? 'rotate-180' : ''}`} />
          </button>
        </div>

        <button
          onClick={() => setIsRoleMenuOpen(!isRoleMenuOpen)}
          className="w-full py-2 px-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-white text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer"
        >
          <span>Switch Role</span>
        </button>

        <button
          onClick={logout}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-red-300 hover:text-red-100 hover:bg-red-500/20 transition-colors cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-64 xl:w-72 flex-col fixed inset-y-0 left-0 z-30 shadow-xl shadow-black/10">
        {sidebarContent}
      </aside>

      {/* Mobile Backdrop & Drawer */}
      {isOpenMobile && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs" onClick={onCloseMobile} />
          <div className="fixed inset-y-0 left-0 w-72 max-w-[85vw] shadow-2xl z-50 animate-in slide-in-from-left duration-200">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  )
}
