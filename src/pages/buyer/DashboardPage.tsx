import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { useAuthStore } from '../../store/authStore'
import type { EnquiryFull } from '../../types/database'
import StatusBadge from '../../components/ui/StatusBadge'
import Spinner from '../../components/ui/Spinner'
import { format } from '../../lib/utils'

export default function DashboardPage() {
  const { user, buyer } = useAuthStore()
  const [enquiries, setEnquiries] = useState<EnquiryFull[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    supabase
      .from('enquiries')
      .select('*, buyers(*), enquiry_items(*, products(*))')
      .eq('buyer_id', user.id)
      .order('submitted_at', { ascending: false })
      .then(({ data }) => {
        setEnquiries((data ?? []) as EnquiryFull[])
        setLoading(false)
      })
  }, [user])

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="section-title mb-1">My Dashboard</h1>
        <div className="gold-divider" />
        <p className="font-sans text-sm text-gray-500 mt-2">
          Welcome back, <strong>{buyer?.contact_name}</strong>
        </p>
      </div>

      <div className="grid sm:grid-cols-3 gap-4 mb-10">
        {[
          { label: 'Company', value: buyer?.company_name },
          { label: 'Phone', value: buyer?.phone },
          { label: 'City', value: buyer?.city },
        ].map((item) => (
          <div key={item.label} className="border border-gray-100 p-4">
            <p className="font-sans text-xs text-gray-400 uppercase tracking-wider mb-1">{item.label}</p>
            <p className="font-sans text-sm text-ink font-medium">{item.value}</p>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between mb-5">
        <h2 className="font-serif text-xl font-medium">My Enquiries</h2>
        <Link to="/enquiry" className="btn-primary text-sm">New Enquiry</Link>
      </div>

      {loading ? (
        <div className="flex justify-center py-12"><Spinner /></div>
      ) : enquiries.length === 0 ? (
        <div className="border border-dashed border-gray-200 py-16 text-center">
          <p className="font-sans text-gray-400 mb-4">No enquiries yet</p>
          <Link to="/catalog" className="btn-outline text-sm">Browse Catalog</Link>
        </div>
      ) : (
        <div className="border border-gray-100 divide-y divide-gray-100">
          {enquiries.map((enq) => (
            <div key={enq.id} className="p-4 flex items-center justify-between gap-4">
              <div className="min-w-0">
                <p className="font-sans text-sm font-medium text-ink truncate">
                  Enquiry #{enq.id.slice(0, 8).toUpperCase()}
                </p>
                <p className="font-sans text-xs text-gray-400 mt-0.5">
                  {enq.enquiry_items?.length ?? 0} items · {format(enq.submitted_at)}
                </p>
              </div>
              <StatusBadge status={enq.status} />
            </div>
          ))}
        </div>
      )}

      <div className="mt-8 flex gap-4">
        <Link to="/profile" className="btn-outline text-sm">Edit Profile</Link>
        <Link to="/catalog" className="btn-ghost text-sm">Browse Catalog</Link>
      </div>
    </div>
  )
}
