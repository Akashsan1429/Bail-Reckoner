import React from 'react'
import { useTranslation } from 'react-i18next'
import { Languages } from 'lucide-react'

export const LanguageSwitcher: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { i18n } = useTranslation()

  const currentLanguage = i18n.language || 'en'

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedLang = e.target.value
    i18n.changeLanguage(selectedLang)
    localStorage.setItem('i18nextLng', selectedLang)
  }

  const getActiveCode = () => {
    if (currentLanguage.startsWith('ta')) return 'ta'
    if (currentLanguage.startsWith('hi')) return 'hi'
    return 'en'
  }

  return (
    <div className={`relative inline-flex items-center rounded-lg border border-surface-deep bg-white px-2 py-1 shadow-2xs hover:border-accent transition-colors ${className}`}>
      <Languages className="w-4 h-4 text-accent mr-1.5 shrink-0" aria-hidden="true" />
      <select
        value={getActiveCode()}
        onChange={handleLanguageChange}
        className="bg-transparent text-xs font-semibold text-ink focus:outline-none cursor-pointer pr-1 py-1"
        aria-label="Select Application Language"
      >
        <option value="en">English (EN)</option>
        <option value="ta">தமிழ் (TA)</option>
        <option value="hi">हिंदी (HI)</option>
      </select>
    </div>
  )
}
