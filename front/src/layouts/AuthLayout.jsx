import { Outlet } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { GiFishEggs } from 'react-icons/gi'

export default function AuthLayout() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-abyss-950">
      <div className="absolute inset-0 bg-ocean-grid bg-[size:36px_36px] opacity-40" />
      <div className="absolute -top-32 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-current-500/20 blur-[120px]" />
      <div className="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-signal-500/20 blur-[120px]" />

      <div className="relative flex min-h-screen flex-col items-center justify-center px-4 py-10">
        <div className="mb-8 flex items-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-current-500 to-signal-500 text-white shadow-glow">
            <GiFishEggs className="h-5 w-5" />
          </div>
          <div>
            <p className="font-display text-lg font-bold leading-tight text-white">Smart Fish</p>
            <p className="text-[11px] text-mist-200/50">Farm Monitoring System</p>
          </div>
        </div>
        <Outlet />
      </div>
      <Toaster position="top-right" />
    </div>
  )
}
