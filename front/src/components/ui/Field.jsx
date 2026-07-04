export function Label({ children, htmlFor }) {
  return (
    <label htmlFor={htmlFor} className="mb-1.5 block text-sm font-medium text-abyss-700 dark:text-mist-100">
      {children}
    </label>
  )
}

export function Input({ className = '', ...props }) {
  return (
    <input
      className={`w-full rounded-xl border border-mist-200 dark:border-abyss-600 bg-mist-50 dark:bg-abyss-800 px-3.5 py-2.5 text-sm text-abyss-800 dark:text-mist-50 placeholder:text-abyss-400 dark:placeholder:text-mist-200/40 outline-none transition focus:border-current-500 focus:ring-2 focus:ring-current-500/20 ${className}`}
      {...props}
    />
  )
}

export function Select({ className = '', children, ...props }) {
  return (
    <select
      className={`w-full rounded-xl border border-mist-200 dark:border-abyss-600 bg-mist-50 dark:bg-abyss-800 px-3.5 py-2.5 text-sm text-abyss-800 dark:text-mist-50 outline-none transition focus:border-current-500 focus:ring-2 focus:ring-current-500/20 ${className}`}
      {...props}
    >
      {children}
    </select>
  )
}

export function Toggle({ checked, onChange, label, description }) {
  return (
    <label className="flex cursor-pointer items-center justify-between gap-4 py-3">
      <span>
        <span className="block text-sm font-medium text-abyss-800 dark:text-mist-50">{label}</span>
        {description && <span className="mt-0.5 block text-xs text-abyss-500 dark:text-mist-200/50">{description}</span>}
      </span>
      <span
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors ${checked ? 'bg-signal-500' : 'bg-mist-200 dark:bg-abyss-600'}`}
      >
        <span
          className={`inline-block h-4.5 w-4.5 h-[18px] w-[18px] transform rounded-full bg-white shadow transition-transform ${checked ? 'translate-x-[22px]' : 'translate-x-[3px]'}`}
        />
      </span>
    </label>
  )
}
