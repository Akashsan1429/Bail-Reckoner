import React, { useState } from 'react'
import { HelpCircle, PhoneCall, Bot, FileText, ChevronDown, Sparkles } from 'lucide-react'

interface HelpPageProps {
  onOpenChat?: () => void
}

const FAQS = [
  {
    question: 'How does Bail Reckoner determine undertrial bail eligibility?',
    answer: 'Bail Reckoner uses a deterministic legal rule engine based on Section 436 and 437 of the Code of Criminal Procedure (CrPC), Bharatiya Nagarik Suraksha Sanhita (BNSS 2023), and statutory maximum sentence thresholds.',
  },
  {
    question: 'What is the distinction between IPC and BNS sections?',
    answer: 'The Indian Penal Code (IPC 1860) was updated with Bharatiya Nyaya Sanhita (BNS 2023). Bail Reckoner automatically cross-references equivalent sections for accurate rule evaluation.',
  },
  {
    question: 'Can I request pro-bono legal aid through this platform?',
    answer: 'Yes! Prisoner families can request pro-bono advocate assignment and bail bond assistance directly via the NGO Admin portal or Legal Aid hotline.',
  },
  {
    question: 'How do I export rule trace audit reports for court submission?',
    answer: 'Navigate to any evaluated case verdict page and click "Export Certified PDF" to generate a standardized legal audit report for judicial submission.',
  },
]

export const HelpPage: React.FC<HelpPageProps> = ({ onOpenChat }) => {
  const [openFaq, setOpenFaq] = useState<number | null>(0)

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-[#1F1D36] flex items-center gap-2">
          <HelpCircle className="w-7 h-7 text-[#403D88]" /> Legal Aid Help & Support Center
        </h1>
        <p className="text-xs md:text-sm text-[#6B6888] mt-1">
          Get assistance with case evaluations, legal aid hotlines, and platform features.
        </p>
      </div>

      {/* Emergency Hotline Banner */}
      <div className="p-6 md:p-8 rounded-3xl bg-gradient-to-r from-[#403D88] via-[#8B639B] to-[#AF719D] text-white shadow-lg flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shrink-0">
            <PhoneCall className="w-7 h-7 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-extrabold">National Legal Services Authority (NALSA) Toll-Free</h3>
            <p className="text-xs text-white/90">24/7 Free legal advice & undertrial assistance hotline</p>
          </div>
        </div>
        <a
          href="tel:15100"
          className="px-6 py-3 rounded-2xl bg-white text-[#403D88] text-sm font-extrabold shadow-md hover:bg-slate-100 transition-colors shrink-0"
        >
          Call 15100
        </a>
      </div>

      {/* AI Assistant Quick Callout */}
      <div className="p-6 rounded-3xl bg-white border border-[#EBE5F5] shadow-sm flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#8B639B]/20 text-[#403D88] flex items-center justify-center shrink-0">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-[#1F1D36]">Ask AI Legal Assistant</h4>
            <p className="text-xs text-[#6B6888]">Get instant answers on IPC sections, custody limits, and bail precedent case laws.</p>
          </div>
        </div>
        {onOpenChat && (
          <button
            onClick={onOpenChat}
            className="px-4 py-2 rounded-xl bg-[#403D88] text-white text-xs font-bold hover:bg-[#312E6B] transition-colors shrink-0 flex items-center gap-1.5 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" /> Launch Chat
          </button>
        )}
      </div>

      {/* FAQ Accordion */}
      <div className="bg-white p-6 rounded-3xl border border-[#EBE5F5] shadow-sm space-y-4">
        <h2 className="text-base font-bold text-[#1F1D36] flex items-center gap-2 border-b border-[#EBE5F5] pb-3">
          <FileText className="w-5 h-5 text-[#8B639B]" /> Frequently Asked Questions
        </h2>

        <div className="space-y-3">
          {FAQS.map((faq, idx) => {
            const isOpen = openFaq === idx
            return (
              <div
                key={idx}
                className="rounded-2xl border border-[#EBE5F5] overflow-hidden transition-all"
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full p-4 text-left font-bold text-xs md:text-sm text-[#1F1D36] bg-[#F8F7FC] hover:bg-[#F3EEF9] flex items-center justify-between gap-4 transition-colors cursor-pointer"
                >
                  <span>{faq.question}</span>
                  <ChevronDown className={`w-4 h-4 text-[#8B639B] transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                </button>
                {isOpen && (
                  <div className="p-4 bg-white text-xs text-[#6B6888] border-t border-[#EBE5F5] leading-relaxed">
                    {faq.answer}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
