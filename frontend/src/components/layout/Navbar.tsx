import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { LanguageSwitcher } from '../ui/LanguageSwitcher'
import { Scale, LogOut, Menu, X, Bot, PlusCircle, LayoutDashboard, FileText, BookOpen } from 'lucide-react'

interface NavbarProps {
  onOpenChat: () => void
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenChat }) => {
  const { user, isAuthenticated, logout } = useAuth()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const location = useLocation()

  const isActive = (path: string) => location.pathname === path

  const navLinks = isAuthenticated
    ? [
        { path: '/dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
        { path: '/cases', label: 'Case Records', icon: <FileText className="w-4 h-4" /> },
        { path: '/cases/new', label: 'Start Check', icon: <PlusCircle className="w-4 h-4" /> },
        { path: '/laws', label: 'Law Library', icon: <BookOpen className="w-4 h-4" /> },
      ]
    : [
        { path: '/', label: 'Home', icon: <Scale className="w-4 h-4" /> },
        { path: '/laws', label: 'Law Library', icon: <BookOpen className="w-4 h-4" /> },
      ]

  return (
    <header className="bg-white border-b border-surface-deep sticky top-0 z-40 shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo & Title */}
        <Link to={isAuthenticated ? '/dashboard' : '/'} className="flex items-center gap-3 group focus-visible:ring-2 focus-visible:ring-accent rounded-lg p-1">
          <div className="w-10 h-10 rounded-xl bg-accent text-white flex items-center justify-center shadow-sm group-hover:bg-accent-hover transition-colors">
            <Scale className="w-6 h-6" />
          </div>
          <div>
            <span className="font-serif font-bold text-lg md:text-xl text-ink tracking-tight block leading-tight">
              Bail Reckoner
            </span>
            <span className="text-[10px] font-mono text-ink-muted uppercase tracking-wider block">
              Digital Legal Aid System
            </span>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-colors min-h-[44px] ${
                isActive(link.path)
                  ? 'bg-surface-light text-accent font-semibold'
                  : 'text-ink hover:bg-surface-base'
              }`}
            >
              {link.icon}
              <span>{link.label}</span>
            </Link>
          ))}
        </nav>

        {/* Actions & Role Controls */}
        <div className="hidden md:flex items-center gap-3">
          <LanguageSwitcher />

          {/* AI Assistant Button */}
          <button
            type="button"
            onClick={onOpenChat}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-accent/30 bg-surface-light hover:bg-surface-mid text-accent text-xs font-semibold transition-colors min-h-[44px] cursor-pointer"
            title="Open AI Legal Assistant"
          >
            <Bot className="w-4 h-4" />
            <span>AI Assistant</span>
          </button>

          {isAuthenticated ? (
            <div className="flex items-center gap-3 pl-2 border-l border-surface-deep">
              <div className="text-right">
                <span className="text-xs font-semibold text-ink block leading-tight">{user?.name}</span>
                <span className="text-[10px] font-mono font-bold uppercase text-accent bg-surface-light px-1.5 py-0.5 rounded">
                  {user?.role?.replace('_', ' ')}
                </span>
              </div>
              <button
                type="button"
                onClick={logout}
                className="p-2 rounded-lg text-ink-muted hover:text-verdict-not-eligible hover:bg-surface-light transition-colors min-h-[44px] cursor-pointer"
                title="Sign Out"
                aria-label="Sign Out"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="px-4 py-2 text-xs font-semibold text-accent hover:bg-surface-light rounded-lg transition-colors min-h-[44px] inline-flex items-center"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 text-xs font-semibold bg-accent text-white hover:bg-accent-hover rounded-lg transition-colors shadow-xs min-h-[44px] inline-flex items-center"
              >
                Register
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <div className="flex items-center gap-2 md:hidden">
          <LanguageSwitcher />
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg text-ink hover:bg-surface-light transition-colors min-h-[44px]"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-surface-deep bg-white px-4 pt-2 pb-4 space-y-2 animate-in slide-in-from-top duration-200">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium ${
                isActive(link.path)
                  ? 'bg-surface-light text-accent font-semibold'
                  : 'text-ink hover:bg-surface-base'
              }`}
            >
              {link.icon}
              <span>{link.label}</span>
            </Link>
          ))}

          <button
            type="button"
            onClick={() => {
              setMobileMenuOpen(false)
              onOpenChat()
            }}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold text-accent bg-surface-light"
          >
            <Bot className="w-5 h-5" />
            <span>AI Legal Assistant</span>
          </button>

          {isAuthenticated ? (
            <div className="pt-2 border-t border-surface-deep space-y-2">
              <div className="px-4 py-2">
                <span className="text-xs font-semibold text-ink block">{user?.name}</span>
                <span className="text-[10px] font-mono uppercase text-ink-muted">{user?.email}</span>
              </div>
              <button
                type="button"
                onClick={logout}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold text-verdict-not-eligible hover:bg-red-50"
              >
                <LogOut className="w-5 h-5" />
                <span>Sign Out</span>
              </button>
            </div>
          ) : (
            <div className="pt-2 border-t border-surface-deep grid grid-cols-2 gap-2">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-2.5 text-center text-sm font-semibold border border-accent text-accent rounded-lg"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-2.5 text-center text-sm font-semibold bg-accent text-white rounded-lg"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  )
}
