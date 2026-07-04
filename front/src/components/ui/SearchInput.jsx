import { FiSearch } from 'react-icons/fi'

export default function SearchInput({ value, onChange, placeholder = 'Search', className = '' }) {
  return (
    <div className={`relative ${className}`}>
      <FiSearch className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-abyss-400 dark:text-mist-200/40" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-xl border border-mist-200 dark:border-abyss-600 bg-mist-50 dark:bg-abyss-800 py-2.5 pl-9 pr-3 text-sm text-abyss-800 dark:text-mist-50 placeholder:text-abyss-400 dark:placeholder:text-mist-200/40 outline-none transition focus:border-current-500 focus:ring-2 focus:ring-current-500/20"
      />
    </div>
  )
}
