import { useState } from 'react'
import { supabase } from '../../lib/supabase'
import { useAuthStore } from '../../store/authStore'
import toast from 'react-hot-toast'

export default function ProfilePage() {
  const { buyer, setBuyer } = useAuthStore()
  const [loading, setLoading] = useState(false)
  const [pwLoading, setPwLoading] = useState(false)
  const [form, setForm] = useState({
    company_name: buyer?.company_name ?? '',
    gst_number: buyer?.gst_number ?? '',
    contact_name: buyer?.contact_name ?? '',
    phone: buyer?.phone ?? '',
    city: buyer?.city ?? '',
  })
  const [newPw, setNewPw] = useState('')
  const [confirmPw, setConfirmPw] = useState('')

  const update = (k: keyof typeof form, v: string) => setForm((f) => ({ ...f, [k]: v }))

  const handleProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!buyer) return
    setLoading(true)
    const { data, error } = await supabase
      .from('buyers')
      .update(form)
      .eq('id', buyer.id)
      .select()
      .single()
    if (error) {
      toast.error(error.message)
    } else {
      setBuyer(data)
      toast.success('Profile updated')
    }
    setLoading(false)
  }

  const handlePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    if (newPw !== confirmPw) { toast.error('Passwords do not match'); return }
    if (newPw.length < 8) { toast.error('Password must be at least 8 characters'); return }
    setPwLoading(true)
    const { error } = await supabase.auth.updateUser({ password: newPw })
    if (error) {
      toast.error(error.message)
    } else {
      toast.success('Password updated')
      setNewPw('')
      setConfirmPw('')
    }
    setPwLoading(false)
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12">
      <h1 className="section-title mb-2">My Profile</h1>
      <div className="gold-divider" />

      <form onSubmit={handleProfile} className="mt-8 space-y-5">
        <h2 className="font-sans text-sm font-semibold uppercase tracking-widest text-gray-400">Company Details</h2>
        <div className="grid sm:grid-cols-2 gap-5">
          <div>
            <label className="font-sans text-xs text-gray-500 uppercase tracking-wider block mb-1.5">Company Name</label>
            <input required className="input-field" value={form.company_name} onChange={(e) => update('company_name', e.target.value)} />
          </div>
          <div>
            <label className="font-sans text-xs text-gray-500 uppercase tracking-wider block mb-1.5">GST Number</label>
            <input className="input-field" value={form.gst_number} onChange={(e) => update('gst_number', e.target.value)} />
          </div>
          <div>
            <label className="font-sans text-xs text-gray-500 uppercase tracking-wider block mb-1.5">Contact Person</label>
            <input required className="input-field" value={form.contact_name} onChange={(e) => update('contact_name', e.target.value)} />
          </div>
          <div>
            <label className="font-sans text-xs text-gray-500 uppercase tracking-wider block mb-1.5">Phone</label>
            <input required className="input-field" value={form.phone} onChange={(e) => update('phone', e.target.value)} />
          </div>
          <div>
            <label className="font-sans text-xs text-gray-500 uppercase tracking-wider block mb-1.5">City</label>
            <input required className="input-field" value={form.city} onChange={(e) => update('city', e.target.value)} />
          </div>
        </div>
        <button type="submit" disabled={loading} className="btn-primary">{loading ? 'Saving…' : 'Save Changes'}</button>
      </form>

      <hr className="my-10 border-gray-100" />

      <form onSubmit={handlePassword} className="space-y-5">
        <h2 className="font-sans text-sm font-semibold uppercase tracking-widest text-gray-400">Change Password</h2>
        <div className="grid sm:grid-cols-2 gap-5">
          <div>
            <label className="font-sans text-xs text-gray-500 uppercase tracking-wider block mb-1.5">New Password</label>
            <input type="password" required className="input-field" value={newPw} onChange={(e) => setNewPw(e.target.value)} minLength={8} placeholder="Min. 8 characters" />
          </div>
          <div>
            <label className="font-sans text-xs text-gray-500 uppercase tracking-wider block mb-1.5">Confirm Password</label>
            <input type="password" required className="input-field" value={confirmPw} onChange={(e) => setConfirmPw(e.target.value)} placeholder="Re-enter password" />
          </div>
        </div>
        <button type="submit" disabled={pwLoading} className="btn-primary">{pwLoading ? 'Updating…' : 'Update Password'}</button>
      </form>
    </div>
  )
}
