import React, { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AuthProvider } from './context/AuthContext'
import { ProtectedRoute } from './components/auth/ProtectedRoute'
import { MainLayout } from './components/layout/MainLayout'
import { ChatbotDrawer } from './components/chat/ChatbotDrawer'

// Pages
import { LandingPage } from './pages/Landing/LandingPage'
import { LoginPage } from './pages/Auth/LoginPage'
import { RegisterPage } from './pages/Auth/RegisterPage'
import { RoleDashboardPage } from './pages/Dashboard/RoleDashboardPage'
import { CaseFormPage } from './pages/Cases/CaseFormPage'
import { CaseHistoryPage } from './pages/Cases/CaseHistoryPage'
import { VerdictPage } from './pages/Verdict/VerdictPage'
import { LawLibraryPage } from './pages/Laws/LawLibraryPage'
import { ProfilePage } from './pages/Profile/ProfilePage'
import { SettingsPage } from './pages/Settings/SettingsPage'
import { HelpPage } from './pages/Help/HelpPage'

import './i18n/i18n'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
})

export const App: React.FC = () => {
  const [isChatOpen, setIsChatOpen] = useState(false)

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <Routes>
            {/* Public Unauthenticated Pages */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Authenticated Dashboard & App Pages Wrapped in MainLayout */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <MainLayout onOpenChat={() => setIsChatOpen(true)}>
                    <RoleDashboardPage onOpenChat={() => setIsChatOpen(true)} />
                  </MainLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/cases"
              element={
                <ProtectedRoute>
                  <MainLayout onOpenChat={() => setIsChatOpen(true)}>
                    <CaseHistoryPage />
                  </MainLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/cases/new"
              element={
                <ProtectedRoute>
                  <MainLayout onOpenChat={() => setIsChatOpen(true)}>
                    <CaseFormPage />
                  </MainLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/cases/:id/verdict"
              element={
                <ProtectedRoute>
                  <MainLayout onOpenChat={() => setIsChatOpen(true)}>
                    <VerdictPage onOpenChat={() => setIsChatOpen(true)} />
                  </MainLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/laws"
              element={
                <ProtectedRoute>
                  <MainLayout onOpenChat={() => setIsChatOpen(true)}>
                    <LawLibraryPage />
                  </MainLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <MainLayout onOpenChat={() => setIsChatOpen(true)}>
                    <ProfilePage />
                  </MainLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/settings"
              element={
                <ProtectedRoute>
                  <MainLayout onOpenChat={() => setIsChatOpen(true)}>
                    <SettingsPage />
                  </MainLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/help"
              element={
                <ProtectedRoute>
                  <MainLayout onOpenChat={() => setIsChatOpen(true)}>
                    <HelpPage onOpenChat={() => setIsChatOpen(true)} />
                  </MainLayout>
                </ProtectedRoute>
              }
            />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>

          {/* Global AI Assistant Chatbot Drawer */}
          <ChatbotDrawer isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  )
}

export default App
