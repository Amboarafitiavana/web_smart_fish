import { AnimatePresence, motion } from 'framer-motion'
import { FiX } from 'react-icons/fi'

export default function Modal({ open, onClose, title, children, footer }) {
  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-abyss-950/60 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.98 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="relative w-full max-w-md rounded-2xl bg-white dark:bg-abyss-900 border border-mist-200 dark:border-abyss-700 shadow-panel"
          >
            <div className="flex items-center justify-between border-b border-mist-200 dark:border-abyss-700 px-5 py-4">
              <h3 className="font-display font-semibold text-abyss-900 dark:text-mist-50">{title}</h3>
              <button
                onClick={onClose}
                className="rounded-lg p-1.5 text-abyss-400 hover:bg-mist-100 dark:hover:bg-abyss-800 dark:text-mist-200/50"
                aria-label="Close"
              >
                <FiX className="h-4 w-4" />
              </button>
            </div>
            <div className="px-5 py-4">{children}</div>
            {footer && <div className="flex justify-end gap-2 border-t border-mist-200 dark:border-abyss-700 px-5 py-4">{footer}</div>}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
