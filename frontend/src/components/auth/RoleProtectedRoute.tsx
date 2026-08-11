import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import type { Role } from '../../types/api'

interface RoleProtectedRouteProps {
  allowedRoles: Role[]
  children: React.ReactNode
}

export const RoleProtectedRoute: React.FC<RoleProtectedRouteProps> = ({
  allowedRoles,
  children,
}) => {
  const { user, isAuthenticated, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface-base">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent" />
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (user && !allowedRoles.includes(user.role)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface-base p-4">
        <div className="bg-white border border-verdict-not-eligible/30 rounded-xl p-6 max-w-md text-center space-y-4 shadow-sm">
          <div className="w-12 h-12 rounded-full bg-red-100 text-verdict-not-eligible flex items-center justify-center mx-auto text-xl">
            🚫
          </div>
          <h2 className="text-xl font-serif font-bold text-ink">Access Restricted</h2>
          <p className="text-xs text-ink-muted leading-relaxed">
            Your current account role (<strong>{user.role}</strong>) does not have authorization to view this module.
          </p>
          <Navigate to="/dashboard" replace />
        </div>
      </div>
    )
  }

  return <>{children}</>
}
