import { useState, useEffect } from 'react'
import { Phone, Search, ChevronDown } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import type { Buyer } from '../../types/database'
import StatusBadge from '../../components/ui/StatusBadge'
import Spinner from '../../components/ui/Spinner'
import { format } from '../../lib/utils'
import toast from 'react-hot-toast'

export default function AdminBuyers() {
  const [buyers, setBuyers] = useState<Buyer[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [expanded, setExpanded] = useState<string | null>(null)
  const [enquiryCounts, setEnquiryCounts] = useState<Record<string, number>>({})

  const load = async () => {
    setLoading(true)
    const { data } = await supabase.from('buyers').select('*').order('created_at', { ascending: false })
    if (data) setBuyers(data)

    const { data: counts } = await supabase
      .from('enquiries')
      .select('buyer_id')
    if (counts) {
      const c: Record<string, number> = {}
      counts.forEach((e) => { c[e.buyer_id] = (c[e.buyer_id] ?? 0) + 1 })
      setEnquiryCounts(c)
    }
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const toggleSuspend = async (buyer: Buyer) => {
    const newStatus = buyer.status === 'active' ? 'suspended' : 'active'
    const { error } = await supabase.from('buyers').update({ status: newStatus }).eq('id', buyer.id)
    if (error) { toast.error(error.message); return }
    setBuyers((prev) => prev.map((b) => b.id === buyer.id ? { ...b, status: newStatus } : b))
    toast.success(`Account ${newStatus}`)
  }

  const filtered = buyers.filter((b) =>
    [b.company_name, b.contact_name, b.email, b.city].join(' ').toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div>
      <h1 className="font-serif text-2xl font-medium mb-6">Buyers</h1>

      <div className="relative mb-4">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input className="input-field pl-9 text-xs" placeholder="Search by company, name, email or city…" value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      {loading ? (
        <div className="flex justify-center py-12"><Spinner /></div>
      ) : (
        <div className="bg-white border border-gray-100 divide-y divide-gray-100">
          {filtered.length === 0 ? (
            <p className="font-sans text-sm text-gray-400 p-6 text-center">No buyers found.</p>
          ) : filtered.map((buyer) => (
            <div key={buyer.id}>
              <button
                onClick={() => setExpanded(expanded === buyer.id ? null : buyer.id)}
                className="w-full flex items-center justify-between px-4 py-3.5 hover:bg-gray-50 text-left"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-sans text-sm font-medium text-ink">{buyer.company_name}</p>
                    <StatusBadge status={buyer.status} />
                  </div>
                  <p className="font-sans text-xs text-gray-400 mt-0.5">
                    {buyer.contact_name} · {buyer.city} · {enquiryCounts[buyer.id] ?? 0} enquiries · Joined {format(buyer.created_at)}
                  </p>
                </div>
                <ChevronDown size={14} className={`text-gray-300 flex-shrink-0 transition-transform ${expanded === buyer.id ? 'rotate-180' : ''}`} />
              </button>

              {expanded === buyer.id && (
                <div className="px-4 pb-4 bg-gray-50 border-t border-gray-100">
                  <div className="grid sm:grid-cols-2 gap-3 mt-3">
                    {[
                      { label: 'Email', value: buyer.email },
                      { label: 'Phone', value: buyer.phone, href: `tel:${buyer.phone}` },
                      { label: 'GST', value: buyer.gst_number ?? '—' },
                      { label: 'City', value: buyer.city },
                      { label: 'Enquiries', value: String(enquiryCounts[buyer.id] ?? 0) },
                      { label: 'Joined', value: format(buyer.created_at) },
                    ].map(({ label, value, href }) => (
                      <div key={label}>
                        <p className="font-sans text-xs text-gray-400">{label}</p>
                        {href ? (
                          <a href={href} className="font-sans text-sm text-gold hover:underline flex items-center gap-1">
                            <Phone size={11} /> {value}
                          </a>
                        ) : (
                          <p className="font-sans text-sm text-ink">{value}</p>
                        )}
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={() => toggleSuspend(buyer)}
                    className={`mt-4 font-sans text-xs px-4 py-2 border transition-colors ${buyer.status === 'active' ? 'border-red-200 text-red-600 hover:bg-red-50' : 'border-green-200 text-green-600 hover:bg-green-50'}`}
                  >
                    {buyer.status === 'active' ? 'Suspend Account' : 'Reactivate Account'}
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
