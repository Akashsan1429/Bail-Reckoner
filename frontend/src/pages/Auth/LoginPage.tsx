import React, { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { Input } from '../../components/ui/Input'
import { Scale, AlertCircle, ArrowRight } from 'lucide-react'

export const LoginPage: React.FC = () => {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim() || !password.trim()) {
      setError('Please enter both email and password.')
      return
    }

    try {
      setIsLoading(true)
      setError(null)
      await login({ email: email.trim(), password: password.trim() })
      const from = (location.state as any)?.from?.pathname || '/dashboard'
      navigate(from, { replace: true })
    } catch (err: any) {
      console.error('Login error:', err)
      const msg = err.response?.data?.message || 'Invalid email or password.'
      setError(msg)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#F8F7FC] flex items-center justify-center p-4">
      <div className="bg-white border border-[#EBE5F5] rounded-3xl p-8 max-w-md w-full shadow-xl space-y-6 relative overflow-hidden">
        <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-[#F8B2B2] via-[#AF719D] to-[#8B639B]" />

        <div className="text-center space-y-3 pt-2">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#F8B2B2] via-[#AF719D] to-[#8B639B] p-0.5 shadow-md mx-auto">
            <div className="w-full h-full bg-[#403D88] rounded-[14px] flex items-center justify-center">
              <Scale className="w-7 h-7 text-[#F8B2B2]" />
            </div>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[#1F1D36]">Sign In to Bail Reckoner</h1>
            <p className="text-xs text-[#6B6888] mt-1">Access your legal-aid caseload and eligibility assessments</p>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-800 text-xs p-3.5 rounded-2xl flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="email"
            label="Email Address *"
            placeholder="e.g. lawyer@bailreckoner.org"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
          />

          <Input
            type="password"
            label="Password *"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
          />

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 rounded-2xl bg-[#403D88] hover:bg-[#312E6B] text-white text-xs font-bold shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            {isLoading ? (
              <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
            ) : (
              <>
                <span>Sign In</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="text-center text-xs text-[#6B6888] border-t border-[#EBE5F5] pt-4">
          Don't have an account?{' '}
          <Link to="/register" className="font-bold text-[#403D88] hover:underline">
            Register Account
          </Link>
        </div>
      </div>
    </div>
  )
}
