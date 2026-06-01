import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Phone, ChevronRight, Search } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import type { EnquiryFull } from '../../types/database'
import StatusBadge from '../../components/ui/StatusBadge'
import Spinner from '../../components/ui/Spinner'
import { format } from '../../lib/utils'
import toast from 'react-hot-toast'

const STATUSES = ['all', 'new', 'called', 'quoted', 'closed'] as const

export default function AdminEnquiries() {
  const [enquiries, setEnquiries] = useState<EnquiryFull[]>([])
  const [loading, setLoading] = useState(true)
  const [searchParams, setSearchParams] = useSearchParams()
  const [search, setSearch] = useState('')
  const [selectedEnquiry, setSelectedEnquiry] = useState<EnquiryFull | null>(null)

  const statusFilter = searchParams.get('status') ?? 'all'

  const load = async () => {
    setLoading(true)
    let query = supabase
      .from('enquiries')
      .select('*, buyers(*), enquiry_items(*, products(*))')
      .order('submitted_at', { ascending: false })
    if (statusFilter !== 'all') query = query.eq('status', statusFilter)
    const { data } = await query
    setEnquiries((data ?? []) as EnquiryFull[])
    setLoading(false)
  }

  useEffect(() => { load() }, [statusFilter])

  const filtered = search
    ? enquiries.filter((e) =>
        e.buyers?.company_name.toLowerCase().includes(search.toLowerCase()) ||
        e.buyers?.contact_name.toLowerCase().includes(search.toLowerCase())
      )
    : enquiries

  return (
    <div className="flex h-full gap-4">
      {/* List */}
      <div className={`${selectedEnquiry ? 'hidden lg:flex' : 'flex'} flex-col flex-1 min-w-0`}>
        <div className="flex items-center justify-between mb-5 gap-3 flex-wrap">
          <h1 className="font-serif text-2xl font-medium">Enquiries</h1>
          <div className="flex gap-2">
            {STATUSES.map((s) => (
              <button
                key={s}
                onClick={() => setSearchParams(s === 'all' ? {} : { status: s })}
                className={`font-sans text-xs px-3 py-1.5 capitalize transition-colors ${statusFilter === s ? 'bg-gold text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <div className="relative mb-4">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input className="input-field pl-9 text-xs" placeholder="Search by company or contact…" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>

        {loading ? (
          <div className="flex justify-center py-12"><Spinner /></div>
        ) : filtered.length === 0 ? (
          <p className="font-sans text-sm text-gray-400 py-8 text-center">No enquiries found.</p>
        ) : (
          <div className="bg-white border border-gray-100 divide-y divide-gray-100 overflow-y-auto">
            {filtered.map((enq) => (
              <button
                key={enq.id}
                onClick={() => setSelectedEnquiry(enq)}
                className={`w-full text-left px-4 py-3.5 hover:bg-gray-50 transition-colors flex items-center justify-between gap-3 ${selectedEnquiry?.id === enq.id ? 'bg-gold/5 border-l-2 border-gold' : ''}`}
              >
                <div className="min-w-0">
                  <p className="font-sans text-sm font-medium text-ink">{enq.buyers?.company_name}</p>
                  <p className="font-sans text-xs text-gray-400 truncate">
                    {enq.buyers?.contact_name} · {enq.enquiry_items?.length ?? 0} items · {format(enq.submitted_at)}
                  </p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <StatusBadge status={enq.status} />
                  <ChevronRight size={14} className="text-gray-300" />
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Detail panel */}
      {selectedEnquiry && (
        <EnquiryDetail
          enquiry={selectedEnquiry}
          onClose={() => setSelectedEnquiry(null)}
          onUpdated={(updated) => {
            setEnquiries((prev) => prev.map((e) => e.id === updated.id ? { ...e, ...updated } : e))
            setSelectedEnquiry((prev) => prev ? { ...prev, ...updated } : null)
          }}
        />
      )}
    </div>
  )
}

interface EnquiryDetailProps {
  enquiry: EnquiryFull
  onClose: () => void
  onUpdated: (updates: Partial<EnquiryFull>) => void
}

function EnquiryDetail({ enquiry, onClose, onUpdated }: EnquiryDetailProps) {
  const [notes, setNotes] = useState(enquiry.admin_notes ?? '')
  const [saving, setSaving] = useState(false)

  const updateStatus = async (status: EnquiryFull['status']) => {
    setSaving(true)
    const { error } = await supabase.from('enquiries').update({ status }).eq('id', enquiry.id)
    if (error) { toast.error(error.message); setSaving(false); return }
    onUpdated({ status })
    toast.success(`Marked as ${status}`)
    setSaving(false)
  }

  const saveNotes = async () => {
    setSaving(true)
    const { error } = await supabase.from('enquiries').update({ admin_notes: notes }).eq('id', enquiry.id)
    if (error) { toast.error(error.message) } else { onUpdated({ admin_notes: notes }); toast.success('Notes saved') }
    setSaving(false)
  }

  return (
    <div className="bg-white border border-gray-100 w-full lg:w-80 xl:w-96 flex-shrink-0 flex flex-col">
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
        <h2 className="font-sans text-sm font-semibold">Enquiry Detail</h2>
        <button onClick={onClose} className="text-gray-400 hover:text-ink font-sans text-sm">✕</button>
      </div>

      <div className="flex-1 overflow-y-auto p-5 space-y-5">
        {/* Buyer */}
        <div>
          <p className="font-sans text-xs text-gray-400 uppercase tracking-wider mb-2">Buyer</p>
          <p className="font-sans text-sm font-medium">{enquiry.buyers?.company_name}</p>
          <p className="font-sans text-xs text-gray-500">{enquiry.buyers?.contact_name}</p>
          <p className="font-sans text-xs text-gray-500">{enquiry.buyers?.city}</p>
          <a href={`tel:${enquiry.buyers?.phone}`} className="flex items-center gap-1.5 font-sans text-sm text-gold hover:underline mt-2">
            <Phone size={13} /> {enquiry.buyers?.phone}
          </a>
          <p className="font-sans text-xs text-gray-500">{enquiry.buyers?.email}</p>
          {enquiry.buyers?.gst_number && <p className="font-sans text-xs text-gray-500">GST: {enquiry.buyers.gst_number}</p>}
        </div>

        {/* Items */}
        <div>
          <p className="font-sans text-xs text-gray-400 uppercase tracking-wider mb-2">Products Requested</p>
          <div className="space-y-2">
            {enquiry.enquiry_items?.map((item) => (
              <div key={item.id} className="border border-gray-100 p-3">
                <p className="font-sans text-sm font-medium">{item.products?.name ?? 'Unknown product'}</p>
                {item.quantity && <p className="font-sans text-xs text-gray-500">Qty: {item.quantity}</p>}
                {item.preferred_shade && <p className="font-sans text-xs text-gray-500">Shade: {item.preferred_shade}</p>}
                {item.buyer_notes && <p className="font-sans text-xs text-gray-500">Note: {item.buyer_notes}</p>}
              </div>
            ))}
          </div>
        </div>

        {/* Status */}
        <div>
          <p className="font-sans text-xs text-gray-400 uppercase tracking-wider mb-2">Update Status</p>
          <div className="grid grid-cols-2 gap-2">
            {(['new', 'called', 'quoted', 'closed'] as const).map((s) => (
              <button
                key={s}
                onClick={() => updateStatus(s)}
                disabled={saving || enquiry.status === s}
                className={`font-sans text-xs py-2 px-3 capitalize border transition-colors ${enquiry.status === s ? 'bg-gold text-white border-gold' : 'border-gray-200 text-gray-600 hover:border-gold hover:text-gold'}`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Notes */}
        <div>
          <p className="font-sans text-xs text-gray-400 uppercase tracking-wider mb-2">Internal Notes</p>
          <textarea
            className="input-field text-xs h-24 resize-none"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add notes about this enquiry…"
          />
          <button onClick={saveNotes} disabled={saving} className="btn-primary text-xs mt-2 w-full">{saving ? 'Saving…' : 'Save Notes'}</button>
        </div>
      </div>
    </div>
  )
}
