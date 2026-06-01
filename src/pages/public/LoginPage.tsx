import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import toast from 'react-hot-toast'

export default function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const from = (location.state as { from?: { pathname: string } })?.from?.pathname ?? '/'
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showReset, setShowReset] = useState(false)
  const [resetSent, setResetSent] = useState(false)

  const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      toast.error(error.message)
      setLoading(false)
      return
    }
    if (data.user?.email === ADMIN_EMAIL) {
      navigate('/admin', { replace: true })
    } else {
      navigate(from === '/admin' ? '/dashboard' : from, { replace: true })
    }
    setLoading(false)
  }

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    })
    if (error) {
      toast.error(error.message)
    } else {
      setResetSent(true)
    }
    setLoading(false)
  }

  if (showReset) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-sm w-full">
          {resetSent ? (
            <div className="text-center">
              <h2 className="font-serif text-2xl font-medium mb-3">Check your email</h2>
              <p className="font-sans text-sm text-gray-500 mb-6">We've sent a password reset link to <strong>{email}</strong>.</p>
              <button onClick={() => { setShowReset(false); setResetSent(false) }} className="btn-outline">Back to Login</button>
            </div>
          ) : (
            <form onSubmit={handleReset} className="bg-white border border-gray-100 p-8">
              <h2 className="font-serif text-2xl font-medium mb-2">Reset Password</h2>
              <p className="font-sans text-sm text-gray-500 mb-6">Enter your email and we'll send you a reset link.</p>
              <label className="font-sans text-xs text-gray-500 uppercase tracking-wider block mb-1.5">Email</label>
              <input required type="email" className="input-field mb-5" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@company.com" />
              <button type="submit" disabled={loading} className="btn-primary w-full py-3">{loading ? 'Sending…' : 'Send Reset Link'}</button>
              <button type="button" onClick={() => setShowReset(false)} className="btn-ghost w-full mt-2 text-sm">Back to Login</button>
            </form>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-sm w-full">
        <div className="text-center mb-8">
          <h1 className="font-serif text-3xl font-medium mb-2">Welcome back</h1>
          <p className="font-sans text-sm text-gray-500">Sign in to your trade account</p>
        </div>

        <form onSubmit={handleLogin} className="bg-white border border-gray-100 p-8 space-y-5">
          <div>
            <label className="font-sans text-xs text-gray-500 uppercase tracking-wider block mb-1.5">Email</label>
            <input required type="email" className="input-field" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@company.com" />
          </div>
          <div>
            <label className="font-sans text-xs text-gray-500 uppercase tracking-wider block mb-1.5">Password</label>
            <input required type="password" className="input-field" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Your password" />
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full py-3">
            {loading ? 'Signing in…' : 'Sign In'}
          </button>

          <div className="flex justify-between font-sans text-xs text-gray-400">
            <button type="button" onClick={() => setShowReset(true)} className="hover:text-gold transition-colors">Forgot password?</button>
            <Link to="/signup" className="hover:text-gold transition-colors">Create account</Link>
          </div>
        </form>
      </div>
    </div>
  )
}
