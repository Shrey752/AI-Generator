import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Trash2, ArrowRight } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { useAuthStore } from '../../store/authStore'
import { useCartStore } from '../../store/cartStore'
import toast from 'react-hot-toast'

export default function EnquiryPage() {
  const { user } = useAuthStore()
  const { items, updateItem, removeItem, clearCart } = useCartStore()
  const navigate = useNavigate()
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async () => {
    if (!user || items.length === 0) return
    setSubmitting(true)
    try {
      const { data: enq, error } = await supabase
        .from('enquiries')
        .insert({ buyer_id: user.id, status: 'new' })
        .select()
        .single()
      if (error || !enq) throw error ?? new Error('Failed to create enquiry')

      const { error: itemsError } = await supabase.from('enquiry_items').insert(
        items.map((item) => ({
          enquiry_id: enq.id,
          product_id: item.product.id,
          quantity: item.quantity || null,
          preferred_shade: item.preferred_shade || null,
          buyer_notes: item.buyer_notes || null,
        }))
      )
      if (itemsError) throw itemsError

      clearCart()
      navigate('/enquiry/success')
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to submit enquiry')
    } finally {
      setSubmitting(false)
    }
  }

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <h1 className="section-title mb-3">Enquiry List</h1>
        <p className="font-sans text-sm text-gray-400 mb-6">Your enquiry list is empty.</p>
        <Link to="/catalog" className="btn-primary">Browse Catalog</Link>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="section-title mb-2">Your Enquiry List</h1>
      <div className="gold-divider" />
      <p className="font-sans text-sm text-gray-500 mt-3 mb-8">
        Review and customise your product enquiry before submitting. We'll call you within 24 hours.
      </p>

      <div className="space-y-4 mb-8">
        {items.map((item) => {
          return (
            <div key={item.product.id} className="border border-gray-100 p-4">
              <div className="flex gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="font-serif text-base font-medium text-ink">{item.product.name}</h3>
                      {item.product.fabric_composition && (
                        <p className="font-sans text-xs text-gray-400 mt-0.5">{item.product.fabric_composition}</p>
                      )}
                    </div>
                    <button
                      onClick={() => removeItem(item.product.id)}
                      className="text-gray-400 hover:text-red-500 transition-colors flex-shrink-0"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>

                  <div className="grid sm:grid-cols-3 gap-3 mt-3">
                    <div>
                      <label className="font-sans text-xs text-gray-400 block mb-1">Quantity / Metres</label>
                      <input
                        className="input-field text-xs py-1.5"
                        placeholder="e.g. 50m"
                        value={item.quantity}
                        onChange={(e) => updateItem(item.product.id, { quantity: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="font-sans text-xs text-gray-400 block mb-1">Preferred Shade</label>
                      <input
                        className="input-field text-xs py-1.5"
                        placeholder="e.g. Navy blue"
                        value={item.preferred_shade}
                        onChange={(e) => updateItem(item.product.id, { preferred_shade: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="font-sans text-xs text-gray-400 block mb-1">Notes</label>
                      <input
                        className="input-field text-xs py-1.5"
                        placeholder="Any specifics"
                        value={item.buyer_notes}
                        onChange={(e) => updateItem(item.product.id, { buyer_notes: e.target.value })}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-gray-100 pt-6">
        <p className="font-sans text-sm text-gray-500">{items.length} product{items.length !== 1 ? 's' : ''} in your list</p>
        <button
          onClick={handleSubmit}
          disabled={submitting}
          className="btn-primary flex items-center gap-2 py-3 px-8"
        >
          {submitting ? 'Submitting…' : 'Submit Enquiry'} <ArrowRight size={15} />
        </button>
      </div>
    </div>
  )
}
