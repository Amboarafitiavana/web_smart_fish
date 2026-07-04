export default function Footer() {
  return (
    <footer className="mt-8 border-t border-mist-200 dark:border-abyss-700 px-4 py-5 text-xs text-abyss-400 dark:text-mist-200/40 lg:px-6">
      <div className="flex flex-col items-center justify-between gap-2 sm:flex-row">
        <p>© {new Date().getFullYear()} Smart Fish. Built for aquaculture operators.</p>
        <p className="readout">System v1.4.0 · All nodes reporting</p>
      </div>
    </footer>
  )
}
