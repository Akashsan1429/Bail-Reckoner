import React from 'react'
import { useTranslation } from 'react-i18next'
import { Languages } from 'lucide-react'

export const LanguageSwitcher: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { i18n } = useTranslation()

  const currentLanguage = i18n.language || 'en'

  const toggleLanguage = () => {
    const nextLang = currentLanguage.startsWith('hi') ? 'en' : 'hi'
    i18n.changeLanguage(nextLang)
  }

  return (
    <button
      type="button"
      onClick={toggleLanguage}
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-surface-deep bg-white hover:bg-surface-light text-ink text-xs font-semibold transition-colors focus-visible:ring-2 focus-visible:ring-accent min-h-[44px] ${className}`}
      aria-label={`Current language: ${currentLanguage.toUpperCase()}. Click to switch to ${
        currentLanguage.startsWith('hi') ? 'English' : 'Hindi (हिंदी)'
      }`}
    >
      <Languages className="w-4 h-4 text-accent" aria-hidden="true" />
      <span>{currentLanguage.startsWith('hi') ? 'हिंदी (HI)' : 'English (EN)'}</span>
    </button>
  )
}
