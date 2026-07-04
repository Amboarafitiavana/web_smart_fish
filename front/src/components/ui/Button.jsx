const variants = {
  primary: 'bg-signal-500 hover:bg-signal-600 text-white shadow-glow',
  ghost: 'bg-transparent hover:bg-mist-100 dark:hover:bg-abyss-800 text-abyss-700 dark:text-mist-100 border border-mist-200 dark:border-abyss-600',
  danger: 'bg-critical-500 hover:bg-critical-600 text-white',
  subtle: 'bg-mist-100 dark:bg-abyss-800 hover:bg-mist-200 dark:hover:bg-abyss-700 text-abyss-700 dark:text-mist-100',
}

const sizes = {
  sm: 'text-xs px-3 py-1.5 gap-1.5',
  md: 'text-sm px-4 py-2.5 gap-2',
  lg: 'text-sm px-5 py-3 gap-2',
}

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  icon: Icon,
  className = '',
  loading = false,
  ...props
}) {
  return (
    <button
      className={`inline-flex items-center justify-center rounded-xl font-medium transition-all duration-200 active:scale-[0.97] disabled:opacity-50 disabled:pointer-events-none ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading ? (
        <span className="h-3.5 w-3.5 rounded-full border-2 border-white/40 border-t-white animate-spin" />
      ) : Icon ? (
        <Icon className="h-4 w-4" />
      ) : null}
      {children}
    </button>
  )
}
