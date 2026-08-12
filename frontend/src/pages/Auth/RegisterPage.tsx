import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { Input } from '../../components/ui/Input'
import { Select } from '../../components/ui/Select'
import type { Role } from '../../types/api'
import { Scale, AlertCircle, ArrowRight } from 'lucide-react'

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
            <h1 className="text-2xl font-bold text-[#1F1D36]">Create Account</h1>
            <p className="text-xs text-[#6B6888] mt-1">Join the legal-aid decision support platform</p>
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

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 rounded-2xl bg-[#403D88] hover:bg-[#312E6B] text-white text-xs font-bold shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            {isLoading ? (
              <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
            ) : (
              <>
                <span>Register Account</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="text-center text-xs text-[#6B6888] border-t border-[#EBE5F5] pt-4">
          Already registered?{' '}
          <Link to="/login" className="font-bold text-[#403D88] hover:underline">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  )
}
