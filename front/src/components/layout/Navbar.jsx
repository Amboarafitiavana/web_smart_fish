import { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FiMenu, FiBell, FiSun, FiMoon, FiLogOut, FiUser, FiSettings } from 'react-icons/fi'
import { useTheme } from '../../contexts/ThemeContext'
import { useAuth } from '../../contexts/AuthContext'
import { useLanguage } from '../../contexts/LanguageContext'
import SearchInput from '../ui/SearchInput'
import ConnectionStatusBadge from './ConnectionStatusBadge'
import { ALERTS, USER } from '../../utils/mockData'

export default function Navbar({ onOpenMobileSidebar }) {
  const { theme, toggleTheme } = useTheme()
  const { logout } = useAuth()
  const { t } = useLanguage()
  const [search, setSearch] = useState('')
  const [notifOpen, setNotifOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const notifRef = useRef(null)
  const menuRef = useRef(null)

  useEffect(() => {
    function onClick(e) {
      if (notifRef.current && !notifRef.current.contains(e.target)) setNotifOpen(false)
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false)
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [])

  const openAlerts = ALERTS.filter((a) => a.status === 'Open' || a.status === 'Monitoring').slice(0, 4)

  return (
    <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-mist-200 dark:border-abyss-700 bg-white/80 dark:bg-abyss-900/80 px-4 py-3 backdrop-blur-md lg:px-6">
      <button
        onClick={onOpenMobileSidebar}
        className="flex h-9 w-9 items-center justify-center rounded-lg text-abyss-500 hover:bg-mist-100 dark:text-mist-200/60 dark:hover:bg-abyss-800 lg:hidden"
      >
        <FiMenu className="h-5 w-5" />
      </button>

      <div className="hidden flex-1 max-w-sm sm:block">
        <SearchInput value={search} onChange={setSearch} placeholder={t('navbar.searchPlaceholder')} />
      </div>
      <div className="flex-1 sm:hidden" />

      <div className="flex items-center gap-2">
        <ConnectionStatusBadge />

        <button
          onClick={toggleTheme}
          className="flex h-9 w-9 items-center justify-center rounded-lg text-abyss-500 hover:bg-mist-100 dark:text-mist-200/60 dark:hover:bg-abyss-800"
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? <FiSun className="h-4.5 w-4.5" /> : <FiMoon className="h-4.5 w-4.5" />}
        </button>

        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setNotifOpen((v) => !v)}
            className="relative flex h-9 w-9 items-center justify-center rounded-lg text-abyss-500 hover:bg-mist-100 dark:text-mist-200/60 dark:hover:bg-abyss-800"
            aria-label="Notifications"
          >
            <FiBell className="h-4.5 w-4.5" />
            {openAlerts.length > 0 && (
              <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-critical-500 ring-2 ring-white dark:ring-abyss-900" />
            )}
          </button>
          {notifOpen && (
            <div className="absolute right-0 mt-2 w-80 rounded-2xl border border-mist-200 dark:border-abyss-700 bg-white dark:bg-abyss-900 p-2 shadow-panel">
              <p className="px-2 py-1.5 text-xs font-semibold uppercase tracking-wide text-abyss-400 dark:text-mist-200/40">{t('navbar.activeAlerts')}</p>
              {openAlerts.map((a) => (
                <div key={a.id} className="rounded-xl px-2 py-2 hover:bg-mist-50 dark:hover:bg-abyss-800">
                  <p className="text-sm font-medium text-abyss-800 dark:text-mist-50">{a.sensor} · {a.pond}</p>
                  <p className="text-xs text-abyss-500 dark:text-mist-200/50">{a.message}</p>
                </div>
              ))}
              <Link to="/alerts" onClick={() => setNotifOpen(false)} className="mt-1 block rounded-xl px-2 py-2 text-center text-xs font-medium text-signal-600 dark:text-signal-400 hover:bg-mist-50 dark:hover:bg-abyss-800">
                {t('navbar.viewAllAlerts')}
              </Link>
            </div>
          )}
        </div>

        <div className="relative" ref={menuRef}>
          <button onClick={() => setMenuOpen((v) => !v)} className="flex items-center gap-2 rounded-lg py-1 pl-1 pr-2 hover:bg-mist-100 dark:hover:bg-abyss-800">
            <span className="flex h-7.5 w-7.5 h-[30px] w-[30px] items-center justify-center rounded-full bg-gradient-to-br from-current-500 to-signal-500 text-xs font-semibold text-white">
              {USER.avatar}
            </span>
            <span className="hidden text-left md:block">
              <span className="block text-sm font-medium leading-tight text-abyss-800 dark:text-mist-50">{USER.name.split(' ')[0]}</span>
            </span>
          </button>
          {menuOpen && (
            <div className="absolute right-0 mt-2 w-52 rounded-2xl border border-mist-200 dark:border-abyss-700 bg-white dark:bg-abyss-900 p-1.5 shadow-panel">
              <Link to="/profile" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 rounded-xl px-2.5 py-2 text-sm text-abyss-700 hover:bg-mist-50 dark:text-mist-100 dark:hover:bg-abyss-800">
                <FiUser className="h-4 w-4" /> {t('navbar.profile')}
              </Link>
              <Link to="/settings" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 rounded-xl px-2.5 py-2 text-sm text-abyss-700 hover:bg-mist-50 dark:text-mist-100 dark:hover:bg-abyss-800">
                <FiSettings className="h-4 w-4" /> {t('navbar.settings')}
              </Link>
              <button onClick={logout} className="flex w-full items-center gap-2 rounded-xl px-2.5 py-2 text-sm text-critical-500 hover:bg-critical-500/5">
                <FiLogOut className="h-4 w-4" /> {t('navbar.signOut')}
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}