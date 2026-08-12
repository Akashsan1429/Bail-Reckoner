import React, { useState, useRef, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { chatApi } from '../../api/chatApi'
import type { ChatResponse, CitationDto } from '../../types/api'
import { CitationChip } from '../ui/CitationChip'
import { Button } from '../ui/Button'
import { Bot, Send, X, User, AlertCircle, PhoneCall, Scale } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

interface ChatMessageItem {
  id: string
  role: 'user' | 'assistant'
  text: string
  citations?: CitationDto[]
  isEligibilityRedirect?: boolean
}

interface ChatbotDrawerProps {
  isOpen: boolean
  onClose: () => void
  caseId?: string
}

export const ChatbotDrawer: React.FC<ChatbotDrawerProps> = ({ isOpen, onClose, caseId }) => {
  const { t } = useTranslation()
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState<ChatMessageItem[]>([
    {
      id: 'welcome-msg',
      role: 'assistant',
      text: 'Greetings. I am the Bail Reckoner AI Legal Assistant. I provide statutory information and section explanations grounded in verified Indian laws. How can I assist your legal inquiry today?',
    },
  ])
  const [sessionId, setSessionId] = useState<string | undefined>(undefined)
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  if (!isOpen) return null

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userText = input.trim()
    setInput('')

    const userMsgId = Math.random().toString(36).substring(2, 9)
    setMessages((prev) => [...prev, { id: userMsgId, role: 'user', text: userText }])
    setIsLoading(true)

    try {
      const response: ChatResponse = await chatApi.sendMessage({
        sessionId,
        caseId,
        message: userText,
      })

      if (response.sessionId) {
        setSessionId(response.sessionId)
      }

      const isRedirect = response.reply.includes('I cannot determine or calculate official bail eligibility')

      const botMsgId = Math.random().toString(36).substring(2, 9)
      setMessages((prev) => [
        ...prev,
        {
          id: botMsgId,
          role: 'assistant',
          text: response.reply,
          citations: response.citations,
          isEligibilityRedirect: isRedirect,
        },
      ])
    } catch (err: any) {
      console.error('Chat error:', err)
      const botMsgId = Math.random().toString(36).substring(2, 9)
      setMessages((prev) => [
        ...prev,
        {
          id: botMsgId,
          role: 'assistant',
          text: 'Apologies, I encountered a communication error with the server. Please verify your connection or try again.',
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 overflow-hidden bg-black/40 backdrop-blur-xs flex justify-end transition-opacity animate-in fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="chatbot-header-title"
    >
      <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between border-l border-surface-deep">
        {/* Header */}
        <div className="p-4 bg-surface-base border-b border-surface-deep flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-accent text-white flex items-center justify-center shadow-xs">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h3 id="chatbot-header-title" className="text-base font-serif font-bold text-ink">
                {t('chat.title')}
              </h3>
              <p className="text-[11px] font-mono text-ink-muted">
                Statutory Context Grounded RAG
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-surface-deep/50 text-ink-muted transition-colors min-h-[44px]"
            aria-label="Close Assistant Panel"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Notice Strip */}
        <div className="bg-amber-50 border-b border-amber-200 px-4 py-2 text-[11px] text-amber-900 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
          <span>{t('chat.disclaimerNotice')}</span>
        </div>

        {/* Message Log */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-xl p-3.5 text-xs md:text-sm leading-relaxed shadow-2xs ${
                  msg.role === 'user'
                    ? 'bg-accent text-white rounded-br-none'
                    : 'bg-surface-base text-ink border border-surface-deep rounded-bl-none'
                }`}
              >
                <div className="flex items-center gap-1.5 mb-1 opacity-75 font-mono text-[10px]">
                  {msg.role === 'user' ? (
                    <>
                      <span>You</span>
                      <User className="w-3 h-3" />
                    </>
                  ) : (
                    <>
                      <Bot className="w-3 h-3 text-accent" />
                      <span>Legal Assistant</span>
                    </>
                  )}
                </div>

                <p className="whitespace-pre-wrap">{msg.text}</p>

                {/* Citations */}
                {msg.citations && msg.citations.length > 0 && (
                  <div className="mt-3 pt-2 border-t border-surface-deep/50 space-y-1">
                    <span className="text-[10px] font-mono font-semibold block text-ink-muted">
                      RETRIEVED CITATIONS:
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {msg.citations.map((c, i) => (
                        <CitationChip key={i} section={c.section} law={c.law} />
                      ))}
                    </div>
                  </div>
                )}

                {/* Redirect CTA if chatbot detects eligibility query */}
                {msg.isEligibilityRedirect && (
                  <div className="mt-3 pt-2 border-t border-amber-300">
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => {
                        onClose()
                        navigate('/cases/new')
                      }}
                      className="w-full mt-1"
                    >
                      <Scale className="w-4 h-4 mr-1" /> Start Eligibility Check
                    </Button>
                  </div>
                )}
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex items-center gap-2 text-xs text-ink-muted font-mono p-2">
              <Bot className="w-4 h-4 text-accent animate-bounce" />
              <span>Analyzing statutory repository...</span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestion Chips */}
        <div className="px-4 py-2 bg-surface-base border-t border-surface-deep flex items-center gap-1.5 overflow-x-auto text-[11px] no-scrollbar">
          <span className="text-ink-muted font-mono font-semibold shrink-0">Prompts:</span>
          {[
            'Is Section 379 IPC bailable?',
            'Explain Section 420 (BNS 318)',
            'Undertrial limits under CrPC 436A',
            'What documents are needed for bail?',
          ].map((promptText, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                setInput(promptText)
                // Auto trigger send
                setTimeout(() => {
                  chatApi.sendMessage({ sessionId, caseId, message: promptText })
                    .then((res) => {
                      if (res.sessionId) setSessionId(res.sessionId)
                      setMessages((prev) => [
                        ...prev,
                        { id: Math.random().toString(), role: 'user', text: promptText },
                        { id: Math.random().toString(), role: 'assistant', text: res.reply, citations: res.citations }
                      ])
                    })
                    .catch((err) => console.error(err))
                }, 50)
              }}
              className="px-2.5 py-1 rounded-full bg-white border border-surface-deep text-ink hover:bg-accent hover:text-white transition-colors shrink-0 shadow-2xs font-medium cursor-pointer"
            >
              {promptText}
            </button>
          ))}
        </div>

        {/* Talk to Lawyer Action & Input Footer */}
        <div className="p-4 bg-surface-base border-t border-surface-deep space-y-3">
          <div className="flex items-center justify-between">
            <a
              href="tel:15100"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-accent hover:underline"
              title="National Legal Services Authority (NALSA) Toll-Free Legal Aid Line"
            >
              <PhoneCall className="w-3.5 h-3.5" /> NALSA Helpline (15100)
            </a>
            <span className="text-[10px] text-ink-muted">Free Statutory Legal Aid</span>
          </div>

          <form onSubmit={handleSend} className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={t('chat.placeholder')}
              className="flex-1 min-h-[44px] px-3.5 py-2.5 rounded-lg border border-surface-deep text-ink bg-white text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-accent"
              disabled={isLoading}
            />
            <Button type="submit" variant="primary" isLoading={isLoading} disabled={!input.trim()}>
              <Send className="w-4 h-4" />
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}
