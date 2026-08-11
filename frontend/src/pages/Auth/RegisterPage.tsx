import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { Input } from '../../components/ui/Input'
import { Select } from '../../components/ui/Select'
import { Button } from '../../components/ui/Button'
import type { Role } from '../../types/api'
import { Scale, AlertCircle } from 'lucide-react'

export const RegisterPage: React.FC = () => {
  const { register } = useAuth()
  const navigate = useNavigate()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState<Role>('LAWYER')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !email.trim() || !password.trim()) {
      setError('Please fill in all required fields.')
      return
    }

    try {
      setIsLoading(true)
      setError(null)
      await register({
        name: name.trim(),
        email: email.trim(),
        password: password.trim(),
        role,
      })
      navigate('/dashboard', { replace: true })
    } catch (err: any) {
      console.error('Registration error:', err)
      const msg = err.response?.data?.message || 'Registration failed. Email may already be registered.'
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
          <h1 className="text-2xl font-serif font-bold text-ink">Register Account</h1>
          <p className="text-xs text-ink-muted">Join the legal-aid decision support portal</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-300 text-red-900 text-xs p-3.5 rounded-lg flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Full Name *"
            placeholder="e.g. Adv. Rajesh Sharma"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <Input
            type="email"
            label="Email Address *"
            placeholder="e.g. rajesh@legalaid.org"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <Input
            type="password"
            label="Password *"
            placeholder="Minimum 6 characters"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <Select
            label="Select System Role *"
            value={role}
            onChange={(e) => setRole(e.target.value as Role)}
            options={[
              { value: 'PRISONER_FAMILY', label: 'Prisoner / Family Member' },
              { value: 'LAWYER', label: 'Legal-Aid Counsel / Lawyer' },
              { value: 'NGO_ADMIN', label: 'NGO Volunteer / Administrator' },
              { value: 'COURT_STAFF', label: 'Court Staff / Administrator' },
              { value: 'ADMIN', label: 'System Administrator' },
            ]}
          />

          <Button type="submit" variant="primary" size="lg" isLoading={isLoading} className="w-full">
            Create Account
          </Button>
        </form>

        <div className="text-center text-xs text-ink-muted border-t border-surface-deep pt-4">
          Already registered?{' '}
          <Link to="/login" className="font-semibold text-accent hover:underline">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  )
}
