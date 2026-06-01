import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Package, MessageSquare, Users, TrendingUp } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import Spinner from '../../components/ui/Spinner'
import StatusBadge from '../../components/ui/StatusBadge'
import { format } from '../../lib/utils'
import type { EnquiryFull } from '../../types/database'

interface Stats {
  products: number
  enquiries: number
  buyers: number
  newEnquiries: number
}

export default function AdminOverview() {
  const [stats, setStats] = useState<Stats>({ products: 0, enquiries: 0, buyers: 0, newEnquiries: 0 })
  const [recent, setRecent] = useState<EnquiryFull[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const [prodRes, enqRes, buyerRes, newEnqRes, recentRes] = await Promise.all([
        supabase.from('products').select('id', { count: 'exact', head: true }).neq('status', 'archived'),
        supabase.from('enquiries').select('id', { count: 'exact', head: true }),
        supabase.from('buyers').select('id', { count: 'exact', head: true }),
        supabase.from('enquiries').select('id', { count: 'exact', head: true }).eq('status', 'new'),
        supabase.from('enquiries').select('*, buyers(*), enquiry_items(*, products(*))').order('submitted_at', { ascending: false }).limit(5),
      ])
      setStats({
        products: prodRes.count ?? 0,
        enquiries: enqRes.count ?? 0,
        buyers: buyerRes.count ?? 0,
        newEnquiries: newEnqRes.count ?? 0,
      })
      setRecent((recentRes.data ?? []) as EnquiryFull[])
      setLoading(false)
    }
    load()
  }, [])

  if (loading) return <div className="flex justify-center py-20"><Spinner /></div>

  const statCards = [
    { label: 'Active Products', value: stats.products, icon: Package, to: '/admin/products', color: 'text-blue-600 bg-blue-50' },
    { label: 'New Enquiries', value: stats.newEnquiries, icon: MessageSquare, to: '/admin/enquiries?status=new', color: 'text-orange-600 bg-orange-50' },
    { label: 'Total Enquiries', value: stats.enquiries, icon: TrendingUp, to: '/admin/enquiries', color: 'text-purple-600 bg-purple-50' },
    { label: 'Registered Buyers', value: stats.buyers, icon: Users, to: '/admin/buyers', color: 'text-green-600 bg-green-50' },
  ]

  return (
    <div>
      <h1 className="font-serif text-2xl font-medium mb-6">Overview</h1>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map(({ label, value, icon: Icon, to, color }) => (
          <Link key={label} to={to} className="bg-white border border-gray-100 p-5 hover:border-gold hover:shadow-sm transition-all">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${color}`}>
              <Icon size={18} />
            </div>
            <div className="font-serif text-2xl font-semibold">{value}</div>
            <div className="font-sans text-xs text-gray-500 mt-0.5">{label}</div>
          </Link>
        ))}
      </div>

      <div className="bg-white border border-gray-100">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-sans text-sm font-semibold text-ink">Recent Enquiries</h2>
          <Link to="/admin/enquiries" className="font-sans text-xs text-gold hover:underline">View all</Link>
        </div>
        {recent.length === 0 ? (
          <p className="font-sans text-sm text-gray-400 p-5">No enquiries yet.</p>
        ) : (
          <div className="divide-y divide-gray-100">
            {recent.map((enq) => (
              <Link key={enq.id} to={`/admin/enquiries/${enq.id}`} className="flex items-center justify-between px-5 py-3 hover:bg-gray-50 transition-colors">
                <div>
                  <p className="font-sans text-sm font-medium text-ink">{enq.buyers?.company_name}</p>
                  <p className="font-sans text-xs text-gray-400 mt-0.5">
                    {enq.buyers?.contact_name} · {enq.enquiry_items?.length ?? 0} items · {format(enq.submitted_at)}
                  </p>
                </div>
                <StatusBadge status={enq.status} />
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
