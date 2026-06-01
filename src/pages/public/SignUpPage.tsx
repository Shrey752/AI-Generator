import { useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import toast from 'react-hot-toast'

interface FormData {
  company_name: string
  gst_number: string
  contact_name: string
  phone: string
  email: string
  city: string
  password: string
  confirm_password: string
}

export default function SignUpPage() {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [form, setForm] = useState<FormData>({
    company_name: '', gst_number: '', contact_name: '', phone: '',
    email: '', city: '', password: '', confirm_password: '',
  })

  const update = (k: keyof FormData, v: string) => setForm((f) => ({ ...f, [k]: v }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (form.password !== form.confirm_password) {
      toast.error('Passwords do not match')
      return
    }
    if (form.password.length < 8) {
      toast.error('Password must be at least 8 characters')
      return
    }
    setLoading(true)
    try {
      const { data, error } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
        options: {
          data: { company_name: form.company_name, contact_name: form.contact_name },
        },
      })
      if (error) throw error

      if (data.user) {
        const { error: buyerError } = await supabase.from('buyers').insert({
          id: data.user.id,
          company_name: form.company_name,
          gst_number: form.gst_number || null,
          contact_name: form.contact_name,
          phone: form.phone,
          email: form.email,
          city: form.city,
          status: 'active',
        })
        if (buyerError) throw buyerError
      }

      setSuccess(true)
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Sign up failed')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <div className="w-16 h-16 bg-gold/10 border-2 border-gold rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-2xl">✉️</span>
          </div>
          <h2 className="font-serif text-2xl font-medium mb-3">Check your email</h2>
          <p className="font-sans text-sm text-gray-500 leading-relaxed mb-6">
            We've sent a verification link to <strong>{form.email}</strong>. Click it to activate your account, then you can log in.
          </p>
          <Link to="/login" className="btn-primary">Go to Login</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="font-serif text-3xl font-medium mb-2">Create Trade Account</h1>
          <p className="font-sans text-sm text-gray-500">Register for wholesale access to our fabric catalog</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white border border-gray-100 p-8 space-y-5">
          <div className="grid sm:grid-cols-2 gap-5">
            <div>
              <label className="font-sans text-xs text-gray-500 uppercase tracking-wider block mb-1.5">Company Name *</label>
              <input required className="input-field" value={form.company_name} onChange={(e) => update('company_name', e.target.value)} placeholder="Your company name" />
            </div>
            <div>
              <label className="font-sans text-xs text-gray-500 uppercase tracking-wider block mb-1.5">GST Number</label>
              <input className="input-field" value={form.gst_number} onChange={(e) => update('gst_number', e.target.value)} placeholder="22AAAAA0000A1Z5" />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-5">
            <div>
              <label className="font-sans text-xs text-gray-500 uppercase tracking-wider block mb-1.5">Contact Person *</label>
              <input required className="input-field" value={form.contact_name} onChange={(e) => update('contact_name', e.target.value)} placeholder="Full name" />
            </div>
            <div>
              <label className="font-sans text-xs text-gray-500 uppercase tracking-wider block mb-1.5">Phone *</label>
              <input required type="tel" className="input-field" value={form.phone} onChange={(e) => update('phone', e.target.value)} placeholder="+91 98765 43210" />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-5">
            <div>
              <label className="font-sans text-xs text-gray-500 uppercase tracking-wider block mb-1.5">Email *</label>
              <input required type="email" className="input-field" value={form.email} onChange={(e) => update('email', e.target.value)} placeholder="you@company.com" />
            </div>
            <div>
              <label className="font-sans text-xs text-gray-500 uppercase tracking-wider block mb-1.5">City *</label>
              <input required className="input-field" value={form.city} onChange={(e) => update('city', e.target.value)} placeholder="Mumbai" />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-5">
            <div>
              <label className="font-sans text-xs text-gray-500 uppercase tracking-wider block mb-1.5">Password *</label>
              <input required type="password" className="input-field" value={form.password} onChange={(e) => update('password', e.target.value)} placeholder="Min. 8 characters" minLength={8} />
            </div>
            <div>
              <label className="font-sans text-xs text-gray-500 uppercase tracking-wider block mb-1.5">Confirm Password *</label>
              <input required type="password" className="input-field" value={form.confirm_password} onChange={(e) => update('confirm_password', e.target.value)} placeholder="Re-enter password" />
            </div>
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full py-3 mt-2">
            {loading ? 'Creating account…' : 'Create Trade Account'}
          </button>

          <p className="font-sans text-xs text-gray-400 text-center">
            Already have an account?{' '}
            <Link to="/login" className="text-gold hover:underline">Log in</Link>
          </p>
        </form>
      </div>
    </div>
  )
}
