import { useState, useEffect } from 'react'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import type { Category } from '../../types/database'
import Spinner from '../../components/ui/Spinner'
import { slugify } from '../../lib/utils'
import toast from 'react-hot-toast'

export default function AdminCategories() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [name, setName] = useState('')
  const [editId, setEditId] = useState<string | null>(null)
  const [editName, setEditName] = useState('')
  const [saving, setSaving] = useState(false)

  const load = async () => {
    const { data } = await supabase.from('categories').select('*').order('name')
    setCategories(data ?? [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return
    setSaving(true)
    const { error } = await supabase.from('categories').insert({ name: name.trim(), slug: slugify(name.trim()) })
    if (error) { toast.error(error.message) } else { toast.success('Category added'); setName(''); load() }
    setSaving(false)
  }

  const handleEdit = async (cat: Category) => {
    if (!editName.trim()) return
    const { error } = await supabase.from('categories').update({ name: editName.trim(), slug: slugify(editName.trim()) }).eq('id', cat.id)
    if (error) { toast.error(error.message) } else { toast.success('Updated'); setEditId(null); load() }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this category? Products using it will lose their category assignment.')) return
    const { error } = await supabase.from('categories').delete().eq('id', id)
    if (error) { toast.error(error.message) } else { toast.success('Deleted'); load() }
  }

  return (
    <div className="max-w-lg">
      <h1 className="font-serif text-2xl font-medium mb-6">Categories</h1>

      <form onSubmit={handleAdd} className="flex gap-3 mb-6">
        <input
          className="input-field flex-1 text-sm"
          placeholder="New category name…"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <button type="submit" disabled={saving} className="btn-primary flex items-center gap-1.5 text-sm">
          <Plus size={14} /> Add
        </button>
      </form>

      {loading ? (
        <Spinner />
      ) : (
        <div className="bg-white border border-gray-100 divide-y divide-gray-100">
          {categories.length === 0 ? (
            <p className="font-sans text-sm text-gray-400 p-4">No categories yet.</p>
          ) : categories.map((cat) => (
            <div key={cat.id} className="flex items-center justify-between px-4 py-3 gap-3">
              {editId === cat.id ? (
                <div className="flex gap-2 flex-1">
                  <input
                    className="input-field text-sm flex-1"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    autoFocus
                    onKeyDown={(e) => { if (e.key === 'Enter') handleEdit(cat); if (e.key === 'Escape') setEditId(null) }}
                  />
                  <button onClick={() => handleEdit(cat)} className="btn-primary text-xs">Save</button>
                  <button onClick={() => setEditId(null)} className="btn-ghost text-xs">Cancel</button>
                </div>
              ) : (
                <>
                  <div>
                    <p className="font-sans text-sm font-medium text-ink">{cat.name}</p>
                    <p className="font-sans text-xs text-gray-400">{cat.slug}</p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => { setEditId(cat.id); setEditName(cat.name) }} className="p-1.5 text-gray-400 hover:text-gold transition-colors">
                      <Pencil size={14} />
                    </button>
                    <button onClick={() => handleDelete(cat.id)} className="p-1.5 text-gray-400 hover:text-red-500 transition-colors">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
