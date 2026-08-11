import React, { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AuthProvider } from './context/AuthContext'
import { ProtectedRoute } from './components/auth/ProtectedRoute'
import { Navbar } from './components/layout/Navbar'
import { Footer } from './components/layout/Footer'
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
          <div className="flex flex-col min-h-screen bg-surface-base text-ink font-sans">
            <Navbar onOpenChat={() => setIsChatOpen(true)} />

            <main className="flex-1">
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/laws" element={<LawLibraryPage />} />

                {/* Protected Routes */}
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <RoleDashboardPage onOpenChat={() => setIsChatOpen(true)} />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/cases"
                  element={
                    <ProtectedRoute>
                      <CaseHistoryPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/cases/new"
                  element={
                    <ProtectedRoute>
                      <CaseFormPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/cases/:id/verdict"
                  element={
                    <ProtectedRoute>
                      <VerdictPage onOpenChat={() => setIsChatOpen(true)} />
                    </ProtectedRoute>
                  }
                />

                {/* Fallback */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>

            <Footer />

            {/* Global AI Assistant Chatbot Drawer */}
            <ChatbotDrawer isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
          </div>
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  )
}

export default App
