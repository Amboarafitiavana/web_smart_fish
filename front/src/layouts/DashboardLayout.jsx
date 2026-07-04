import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import Sidebar from '../components/layout/Sidebar'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import { RealtimeProvider } from '../contexts/RealtimeContext'

export default function DashboardLayout() {
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <RealtimeProvider>
      <div className="flex min-h-screen bg-mist-50 dark:bg-abyss-950">
        <Sidebar
          collapsed={collapsed}
          onToggle={() => setCollapsed((c) => !c)}
          mobileOpen={mobileOpen}
          onCloseMobile={() => setMobileOpen(false)}
        />
        <div className="flex min-h-screen flex-1 flex-col">
          <Navbar onOpenMobileSidebar={() => setMobileOpen(true)} />
          <main className="flex-1 px-4 py-6 lg:px-6">
            <Outlet />
          </main>
          <Footer />
        </div>
        <Toaster
          position="top-right"
          toastOptions={{
            className: 'font-body text-sm',
            style: { borderRadius: '12px' },
          }}
        />
      </div>
    </RealtimeProvider>
  )
}