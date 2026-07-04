import { NavLink } from 'react-router-dom'
import {
  FiGrid, FiActivity, FiBarChart2, FiBell, FiClock, FiFileText, FiSettings, FiUser, FiChevronsLeft,
} from 'react-icons/fi'
import { GiFishEggs } from 'react-icons/gi'
import { useLanguage } from '../../contexts/LanguageContext'

const NAV = [
  { to: '/', key: 'dashboard', icon: FiGrid, end: true },
  { to: '/sensors', key: 'sensors', icon: FiActivity },
  { to: '/analytics', key: 'analytics', icon: FiBarChart2 },
  { to: '/alerts', key: 'alerts', icon: FiBell },
  { to: '/history', key: 'history', icon: FiClock },
  { to: '/reports', key: 'reports', icon: FiFileText },
]

const NAV_BOTTOM = [
  { to: '/settings', key: 'settings', icon: FiSettings },
  { to: '/profile', key: 'profile', icon: FiUser },
]

export default function Sidebar({ collapsed, onToggle, mobileOpen, onCloseMobile }) {
  const { t } = useLanguage()

  const linkClass = ({ isActive }) =>
    `group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
      isActive
        ? 'bg-signal-500/10 text-signal-600 dark:text-signal-400'
        : 'text-abyss-500 hover:bg-mist-100 hover:text-abyss-800 dark:text-mist-200/60 dark:hover:bg-abyss-800 dark:hover:text-mist-50'
    }`

  const content = (
    <>
      <div className={`flex items-center gap-2.5 px-3 pb-6 pt-1 ${collapsed ? 'justify-center' : ''}`}>
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-current-500 to-signal-500 text-white shadow-glow">
          <GiFishEggs className="h-5 w-5" />
        </div>
        {!collapsed && (
          <div>
            <p className="font-display text-sm font-bold leading-tight text-abyss-900 dark:text-mist-50">Smart Fish</p>
            <p className="text-[11px] text-abyss-400 dark:text-mist-200/40">{t('sidebar.tagline')}</p>
          </div>
        )}
      </div>

      <nav className="flex flex-1 flex-col gap-1 px-2">
        {NAV.map((item) => (
          <NavLink key={item.to} to={item.to} end={item.end} className={linkClass} title={collapsed ? t(`sidebar.${item.key}`) : undefined}>
            <item.icon className="h-4.5 w-4.5 shrink-0" />
            {!collapsed && <span>{t(`sidebar.${item.key}`)}</span>}
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto flex flex-col gap-1 border-t border-mist-200 dark:border-abyss-700 px-2 pt-3">
        {NAV_BOTTOM.map((item) => (
          <NavLink key={item.to} to={item.to} className={linkClass} title={collapsed ? t(`sidebar.${item.key}`) : undefined}>
            <item.icon className="h-4.5 w-4.5 shrink-0" />
            {!collapsed && <span>{t(`sidebar.${item.key}`)}</span>}
          </NavLink>
        ))}
        <button
          onClick={onToggle}
          className="hidden lg:flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-abyss-400 hover:bg-mist-100 hover:text-abyss-700 dark:text-mist-200/40 dark:hover:bg-abyss-800 dark:hover:text-mist-100"
        >
          <FiChevronsLeft className={`h-4.5 w-4.5 shrink-0 transition-transform ${collapsed ? 'rotate-180' : ''}`} />
          {!collapsed && <span>{t('sidebar.collapse')}</span>}
        </button>
      </div>
    </>
  )

  return (
    <>
      <aside
        className={`hidden lg:flex sticky top-0 h-screen shrink-0 flex-col border-r border-mist-200 dark:border-abyss-700 bg-white dark:bg-abyss-900 py-4 transition-all duration-300 ${
          collapsed ? 'w-[76px]' : 'w-64'
        }`}
      >
        {content}
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-abyss-950/60" onClick={onCloseMobile} />
          <aside className="relative flex h-full w-64 flex-col bg-white dark:bg-abyss-900 py-4 shadow-panel">
            {content}
          </aside>
        </div>
      )}
    </>
  )
}