import React, { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { Input } from '../../components/ui/Input'
import { Button } from '../../components/ui/Button'
import { Scale, AlertCircle } from 'lucide-react'

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
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <div className="bg-white border-2 border-surface-deep rounded-2xl p-6 md:p-8 max-w-md w-full shadow-md space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-xl bg-accent text-white flex items-center justify-center mx-auto shadow-sm">
            <Scale className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-serif font-bold text-ink">Sign In to Bail Reckoner</h1>
          <p className="text-xs text-ink-muted">Access your legal-aid caseload and eligibility assessments</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-300 text-red-900 text-xs p-3.5 rounded-lg flex items-start gap-2">
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

          <Button type="submit" variant="primary" size="lg" isLoading={isLoading} className="w-full">
            Sign In
          </Button>
        </form>

        <div className="text-center text-xs text-ink-muted border-t border-surface-deep pt-4">
          Don't have an account?{' '}
          <Link to="/register" className="font-semibold text-accent hover:underline">
            Register Account
          </Link>
        </div>
      </div>
    </div>
  )
}
