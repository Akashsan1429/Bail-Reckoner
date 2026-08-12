import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { LanguageSwitcher } from '../ui/LanguageSwitcher'
import {
  Menu,
  Search,
  Bell,
  Calendar,
  ChevronDown,
  User as UserIcon,
  LogOut,
  Settings,
  HelpCircle,
} from 'lucide-react'

interface TopBarProps {
  onOpenMobileSidebar: () => void
}

export const TopBar: React.FC<TopBarProps> = ({ onOpenMobileSidebar }) => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/cases?q=${encodeURIComponent(searchQuery)}`)
    }
  }

  return (
    <header className="sticky top-0 z-20 bg-white/90 backdrop-blur-md border-b border-[#EBE5F5] px-4 lg:px-8 py-3 flex items-center justify-between gap-4 shadow-xs">
      {/* Left: Mobile Toggle & Global Search Bar */}
      <div className="flex items-center gap-3 flex-1 max-w-xl">
        <button
          onClick={onOpenMobileSidebar}
          className="lg:hidden p-2 rounded-xl text-[#403D88] hover:bg-[#FAF7FC] border border-[#EBE5F5] transition-colors"
          aria-label="Open Navigation"
        >
          <Menu className="w-5 h-5" />
        </button>

        <form onSubmit={handleSearch} className="relative w-full">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#6B6888]" />
          <input
            type="text"
            placeholder="Search cases, IPC sections,CNR numbers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-16 py-2 rounded-xl bg-[#F8F7FC] border border-[#EBE5F5] text-xs md:text-sm text-[#1F1D36] placeholder-[#9B98B4] focus:outline-none focus:ring-2 focus:ring-[#8B639B]/30 focus:border-[#8B639B] transition-all"
          />
          <kbd className="hidden sm:inline-flex items-center gap-0.5 absolute right-3 top-1/2 -translate-y-1/2 px-2 py-0.5 text-[10px] font-mono text-[#6B6888] bg-white border border-[#EBE5F5] rounded-md shadow-2xs">
            Ctrl + K
          </kbd>
        </form>
      </div>

      {/* Right: Controls, Date Picker, Notifications & User Avatar */}
      <div className="flex items-center gap-3">
        {/* Date Selector Pill */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#F8F7FC] border border-[#EBE5F5] text-xs font-semibold text-[#403D88]">
          <Calendar className="w-4 h-4 text-[#8B639B]" />
          <span>May 12 - May 18, 2025</span>
          <ChevronDown className="w-3.5 h-3.5 text-[#6B6888]" />
        </div>

        {/* Language Switcher */}
        <LanguageSwitcher />

        {/* Notifications Icon with Badge */}
        <button
          className="relative p-2 rounded-xl text-[#403D88] bg-[#F8F7FC] hover:bg-[#F3EEF9] border border-[#EBE5F5] transition-colors cursor-pointer"
          title="Notifications"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-[#EF4444] text-white text-[9px] font-bold flex items-center justify-center animate-pulse">
            3
          </span>
        </button>

        {/* User Profile Menu Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
            className="flex items-center gap-2.5 p-1.5 rounded-xl hover:bg-[#F8F7FC] transition-colors border border-transparent hover:border-[#EBE5F5] cursor-pointer"
          >
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#F8B2B2] via-[#AF719D] to-[#8B639B] p-0.5 shadow-sm">
              <div className="w-full h-full rounded-full bg-white flex items-center justify-center text-[#403D88] font-bold text-xs">
                {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </div>
            </div>
            <div className="hidden sm:block text-left">
              <span className="block text-xs font-bold text-[#1F1D36] leading-tight">
                {user?.name || 'Rahul Sharma'}
              </span>
              <span className="block text-[10px] text-[#6B6888] font-medium capitalize">
                {user?.role ? user.role.replace('_', ' ').toLowerCase() : 'Family Member'}
              </span>
            </div>
            <ChevronDown className="w-4 h-4 text-[#6B6888]" />
          </button>

          {isUserMenuOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white border border-[#EBE5F5] rounded-2xl shadow-xl z-50 p-2 space-y-1 animate-in fade-in duration-150">
              <div className="px-3 py-2 border-b border-[#EBE5F5]">
                <p className="text-xs font-bold text-[#1F1D36]">{user?.name}</p>
                <p className="text-[11px] text-[#6B6888] truncate">{user?.email}</p>
              </div>

              <button
                onClick={() => {
                  setIsUserMenuOpen(false)
                  navigate('/profile')
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-[#1F1D36] hover:bg-[#F8F7FC] rounded-xl transition-colors"
              >
                <UserIcon className="w-4 h-4 text-[#8B639B]" />
                Profile Settings
              </button>

              <button
                onClick={() => {
                  setIsUserMenuOpen(false)
                  navigate('/settings')
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-[#1F1D36] hover:bg-[#F8F7FC] rounded-xl transition-colors"
              >
                <Settings className="w-4 h-4 text-[#8B639B]" />
                Preferences
              </button>

              <button
                onClick={() => {
                  setIsUserMenuOpen(false)
                  navigate('/help')
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-[#1F1D36] hover:bg-[#F8F7FC] rounded-xl transition-colors"
              >
                <HelpCircle className="w-4 h-4 text-[#8B639B]" />
                Help & Support
              </button>

              <div className="border-t border-[#EBE5F5] pt-1">
                <button
                  onClick={logout}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
