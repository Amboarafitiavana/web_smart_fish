import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { FiMail, FiLock, FiArrowRight } from 'react-icons/fi'
import { motion } from 'framer-motion'
import { useAuth } from '../contexts/AuthContext'
import { Label, Input } from '../components/ui/Field'
import Button from '../components/ui/Button'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('rakoto@smartfish.io')
  const [password, setPassword] = useState('')
  const [remember, setRemember] = useState(true)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await login(email, password)
      toast.success('Signed in — welcome back')
      navigate('/')
    } catch {
      toast.error('Couldn\u2019t sign in. Check your details and try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full max-w-sm rounded-2xl border border-abyss-700 bg-abyss-900/90 p-7 shadow-panel backdrop-blur-xl"
    >
      <h1 className="font-display text-xl font-semibold text-white">Sign in to your farm</h1>
      <p className="mt-1 text-sm text-mist-200/50">Monitor water quality across every pond, in real time.</p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div>
          <Label htmlFor="email">Email</Label>
          <div className="relative">
            <FiMail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-mist-200/30" />
            <Input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@smartfish.io"
              className="!bg-abyss-800 !border-abyss-600 !text-mist-50 pl-9"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <FiLock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-mist-200/30" />
            <Input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="!bg-abyss-800 !border-abyss-600 !text-mist-50 pl-9"
            />
          </div>
        </div>

        <div className="flex items-center justify-between text-sm">
          <label className="flex items-center gap-2 text-mist-200/60">
            <input
              type="checkbox"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
              className="h-4 w-4 rounded border-abyss-600 bg-abyss-800 accent-current-500"
            />
            Remember me
          </label>
          <button type="button" className="text-signal-400 hover:text-signal-300">
            Forgot password?
          </button>
        </div>

        <Button type="submit" loading={loading} className="w-full !justify-center">
          Log in <FiArrowRight className="h-4 w-4" />
        </Button>
      </form>

      <p className="mt-5 text-center text-xs text-mist-200/40">
        Frontend demo — any email and password will sign you in.
      </p>
    </motion.div>
  )
}
