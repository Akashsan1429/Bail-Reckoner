import React, { useState } from 'react'
import { Settings, Bell, Globe, Save, CheckCircle2 } from 'lucide-react'

export const SettingsPage: React.FC = () => {
  const [emailAlerts, setEmailAlerts] = useState(true)
  const [smsAlerts, setSmsAlerts] = useState(false)
  const [saved, setSaved] = useState(false)

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-[#1F1D36] flex items-center gap-2">
          <Settings className="w-7 h-7 text-[#403D88]" /> Platform Preferences & Settings
        </h1>
        <p className="text-xs md:text-sm text-[#6B6888] mt-1">
          Manage system notification preferences, regional language choices, and legal aid display options.
        </p>
      </div>

      {saved && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-800 text-xs font-bold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          Settings saved successfully!
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Notification Settings */}
        <div className="bg-white p-6 rounded-3xl border border-[#EBE5F5] shadow-sm space-y-4">
          <h2 className="text-base font-bold text-[#1F1D36] flex items-center gap-2 border-b border-[#EBE5F5] pb-3">
            <Bell className="w-5 h-5 text-[#8B639B]" /> Case Notification Alerts
          </h2>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-[#1F1D36] block">Email Case Verdict Updates</span>
                <span className="text-[11px] text-[#6B6888]">Receive notifications when rule engine evaluates bail status</span>
              </div>
              <input
                type="checkbox"
                checked={emailAlerts}
                onChange={(e) => setEmailAlerts(e.target.checked)}
                className="w-5 h-5 accent-[#403D88] rounded-md cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-[#1F1D36] block">SMS Hearing Date Reminders</span>
                <span className="text-[11px] text-[#6B6888]">Receive SMS alerts 24 hours prior to court appearance dates</span>
              </div>
              <input
                type="checkbox"
                checked={smsAlerts}
                onChange={(e) => setSmsAlerts(e.target.checked)}
                className="w-5 h-5 accent-[#403D88] rounded-md cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Display & Language */}
        <div className="bg-white p-6 rounded-3xl border border-[#EBE5F5] shadow-sm space-y-4">
          <h2 className="text-base font-bold text-[#1F1D36] flex items-center gap-2 border-b border-[#EBE5F5] pb-3">
            <Globe className="w-5 h-5 text-[#AF719D]" /> Language & Interface Preferences
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-[#1F1D36] block mb-1.5">Primary Legal Language</label>
              <select className="w-full p-3 rounded-xl bg-[#F8F7FC] border border-[#EBE5F5] text-xs font-medium text-[#1F1D36]">
                <option value="en">English (Official Court Terminology)</option>
                <option value="hi">हिंदी (Hindi Legal Aid)</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-[#1F1D36] block mb-1.5">Theme Palette</label>
              <select className="w-full p-3 rounded-xl bg-[#F8F7FC] border border-[#EBE5F5] text-xs font-medium text-[#1F1D36]">
                <option value="pastel">Peach Purple Navy Pastel (Active)</option>
                <option value="dark">Deep Navy Dark Mode</option>
              </select>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="px-6 py-3 rounded-2xl bg-[#403D88] hover:bg-[#312E6B] text-white text-xs font-bold shadow-md transition-all flex items-center gap-2 cursor-pointer"
          >
            <Save className="w-4 h-4" /> Save Preferences
          </button>
        </div>
      </form>
    </div>
  )
}
