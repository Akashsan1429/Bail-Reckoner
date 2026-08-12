import React, { useState } from 'react'
import { Sidebar } from './Sidebar'
import { TopBar } from './TopBar'

interface MainLayoutProps {
  children: React.ReactNode
  onOpenChat: () => void
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children, onOpenChat }) => {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-[#F8F7FC] text-[#1F1D36] flex flex-col lg:flex-row font-sans selection:bg-[#F8B2B2]/30">
      {/* Fixed Left Sidebar */}
      <Sidebar
        onOpenChat={onOpenChat}
        isOpenMobile={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
      />

      {/* Main Right Content Section */}
      <div className="flex-1 lg:pl-64 xl:pl-72 flex flex-col min-h-screen transition-all">
        <TopBar onOpenMobileSidebar={() => setIsMobileSidebarOpen(true)} />

        <main className="flex-1 w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10 py-6 sm:py-8 space-y-8">
          {children}
        </main>
      </div>
    </div>
  )
}
