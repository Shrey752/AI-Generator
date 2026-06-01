import { useState, useEffect, useRef } from 'react'
import { Plus, Search, Upload, Archive, Edit } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import type { ProductFull, Category } from '../../types/database'
import StatusBadge from '../../components/ui/StatusBadge'
import Spinner from '../../components/ui/Spinner'
import { slugify } from '../../lib/utils'
import toast from 'react-hot-toast'

export default function AdminProducts() {
  const [products, setProducts] = useState<ProductFull[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filterCat, setFilterCat] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editProduct, setEditProduct] = useState<ProductFull | null>(null)
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const csvRef = useRef<HTMLInputElement>(null)

  const load = async () => {
    setLoading(true)
    const [catRes, prodRes] = await Promise.all([
      supabase.from('categories').select('*').order('name'),
      supabase.from('products').select('*, categories(*), product_colors(*), product_images(*)').order('created_at', { ascending: false }),
    ])
    if (catRes.data) setCategories(catRes.data)
    if (prodRes.data) setProducts(prodRes.data as ProductFull[])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const filtered = products.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase())
    const matchCat = filterCat ? p.category_id === filterCat : true
    return matchSearch && matchCat
  })

  const handleArchive = async (ids: string[]) => {
    await supabase.from('products').update({ status: 'archived' }).in('id', ids)
    setSelected(new Set())
    load()
    toast.success('Archived')
  }

  const handleCSV = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const text = await file.text()
    const lines = text.trim().split('\n').slice(1) // skip header
    const errors: string[] = []
    const rows = lines.map((line, i) => {
      const cols = line.split(',').map((c) => c.trim().replace(/^"|"$/g, ''))
      const [name, description, category_name, fabric_composition, weave_type, width, gsm_raw] = cols
      if (!name) { errors.push(`Row ${i + 2}: missing name`); return null }
      const category = categories.find((c) => c.name.toLowerCase() === category_name?.toLowerCase())
      return {
        name,
        slug: slugify(name),
        description: description || null,
        category_id: category?.id ?? null,
        fabric_composition: fabric_composition || null,
        weave_type: weave_type || null,
        width: width || null,
        gsm: gsm_raw ? parseInt(gsm_raw) : null,
        status: 'active' as const,
      }
    }).filter(Boolean)

    if (errors.length > 0) {
      toast.error(errors.slice(0, 3).join('\n') + (errors.length > 3 ? `\n…and ${errors.length - 3} more` : ''))
      return
    }

    const { error } = await supabase.from('products').insert(rows as never[])
    if (error) {
      toast.error(error.message)
    } else {
      toast.success(`Imported ${rows.length} products`)
      load()
    }
    if (csvRef.current) csvRef.current.value = ''
  }

  const downloadTemplate = () => {
    const csv = 'name,description,category_name,fabric_composition,weave_type,width,gsm\nExample Cotton Saree,Pure cotton weave,Cotton,100% Cotton,Plain weave,44 inches,120\n'
    const a = document.createElement('a')
    a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }))
    a.download = 'nemideep_products_template.csv'
    a.click()
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
        <h1 className="font-serif text-2xl font-medium">Products</h1>
        <div className="flex gap-2 flex-wrap">
          <button onClick={downloadTemplate} className="btn-ghost text-xs flex items-center gap-1.5">
            CSV Template
          </button>
          <label className="btn-outline text-xs flex items-center gap-1.5 cursor-pointer">
            <Upload size={13} /> Import CSV
            <input ref={csvRef} type="file" accept=".csv" className="hidden" onChange={handleCSV} />
          </label>
          <button onClick={() => { setEditProduct(null); setShowForm(true) }} className="btn-primary text-xs flex items-center gap-1.5">
            <Plus size={13} /> Add Product
          </button>
        </div>
      </div>

      <div className="flex gap-3 mb-5 flex-wrap">
        <div className="relative flex-1 min-w-40">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input className="input-field pl-9 text-xs" placeholder="Search products…" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <select className="input-field text-xs w-40" value={filterCat} onChange={(e) => setFilterCat(e.target.value)}>
          <option value="">All categories</option>
          {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        {selected.size > 0 && (
          <button onClick={() => handleArchive(Array.from(selected))} className="btn-outline text-xs flex items-center gap-1.5 text-red-600 border-red-200 hover:bg-red-50">
            <Archive size={13} /> Archive {selected.size}
          </button>
        )}
      </div>

      {loading ? (
        <div className="flex justify-center py-12"><Spinner /></div>
      ) : (
        <div className="bg-white border border-gray-100 overflow-x-auto">
          <table className="w-full text-sm font-sans">
            <thead>
              <tr className="border-b border-gray-100 text-left">
                <th className="w-8 p-3"><input type="checkbox" onChange={(e) => setSelected(e.target.checked ? new Set(filtered.map((p) => p.id)) : new Set())} /></th>
                <th className="p-3 text-xs text-gray-400 uppercase tracking-wider font-medium">Product</th>
                <th className="p-3 text-xs text-gray-400 uppercase tracking-wider font-medium hidden md:table-cell">Category</th>
                <th className="p-3 text-xs text-gray-400 uppercase tracking-wider font-medium hidden md:table-cell">Composition</th>
                <th className="p-3 text-xs text-gray-400 uppercase tracking-wider font-medium">Status</th>
                <th className="p-3 text-xs text-gray-400 uppercase tracking-wider font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.length === 0 ? (
                <tr><td colSpan={6} className="p-6 text-center text-gray-400 text-sm">No products found</td></tr>
              ) : filtered.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50">
                  <td className="p-3">
                    <input type="checkbox" checked={selected.has(p.id)} onChange={(e) => {
                      const s = new Set(selected)
                      e.target.checked ? s.add(p.id) : s.delete(p.id)
                      setSelected(s)
                    }} />
                  </td>
                  <td className="p-3 font-medium text-ink">{p.name}</td>
                  <td className="p-3 text-gray-500 hidden md:table-cell">{p.categories?.name ?? '—'}</td>
                  <td className="p-3 text-gray-500 hidden md:table-cell">{p.fabric_composition ?? '—'}</td>
                  <td className="p-3"><StatusBadge status={p.status} /></td>
                  <td className="p-3">
                    <div className="flex gap-2">
                      <button onClick={() => { setEditProduct(p); setShowForm(true) }} className="p-1.5 text-gray-400 hover:text-gold transition-colors">
                        <Edit size={14} />
                      </button>
                      {p.status !== 'archived' && (
                        <button onClick={() => handleArchive([p.id])} className="p-1.5 text-gray-400 hover:text-red-500 transition-colors">
                          <Archive size={14} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showForm && (
        <ProductForm
          product={editProduct}
          categories={categories}
          onClose={() => setShowForm(false)}
          onSaved={() => { setShowForm(false); load() }}
        />
      )}
    </div>
  )
}

interface ProductFormProps {
  product: ProductFull | null
  categories: Category[]
  onClose: () => void
  onSaved: () => void
}

function ProductForm({ product, categories, onClose, onSaved }: ProductFormProps) {
  const [saving, setSaving] = useState(false)
  const [imageUploading, setImageUploading] = useState(false)
  const [form, setForm] = useState({
    name: product?.name ?? '',
    description: product?.description ?? '',
    category_id: product?.category_id ?? '',
    fabric_composition: product?.fabric_composition ?? '',
    weave_type: product?.weave_type ?? '',
    width: product?.width ?? '',
    gsm: product?.gsm?.toString() ?? '',
    status: product?.status ?? 'active',
    colors: product?.product_colors?.map((c) => c.color_name).join(', ') ?? '',
  })

  const up = (k: keyof typeof form, v: string) => setForm((f) => ({ ...f, [k]: v }))

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!product?.id) { toast.error('Save product first before adding images'); return }
    const files = Array.from(e.target.files ?? [])
    if (files.length === 0) return
    setImageUploading(true)
    for (const file of files) {
      const ext = file.name.split('.').pop()
      const path = `products/${product.id}/${Date.now()}.${ext}`
      const { error: upErr } = await supabase.storage.from('product-images').upload(path, file)
      if (upErr) { toast.error(upErr.message); continue }
      const { data: { publicUrl } } = supabase.storage.from('product-images').getPublicUrl(path)
      const currentMax = product.product_images?.length ?? 0
      await supabase.from('product_images').insert({ product_id: product.id, image_url: publicUrl, sort_order: currentMax + 1 })
    }
    setImageUploading(false)
    toast.success('Images uploaded')
    onSaved()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      const payload = {
        name: form.name,
        slug: slugify(form.name),
        description: form.description || null,
        category_id: form.category_id || null,
        fabric_composition: form.fabric_composition || null,
        weave_type: form.weave_type || null,
        width: form.width || null,
        gsm: form.gsm ? parseInt(form.gsm) : null,
        status: form.status as 'active' | 'draft' | 'archived',
      }

      let productId = product?.id
      if (product) {
        const { error } = await supabase.from('products').update(payload).eq('id', product.id)
        if (error) throw error
      } else {
        const { data, error } = await supabase.from('products').insert(payload).select().single()
        if (error || !data) throw error ?? new Error('Insert failed')
        productId = data.id
      }

      if (form.colors && productId) {
        await supabase.from('product_colors').delete().eq('product_id', productId)
        const colorList = form.colors.split(',').map((c) => c.trim()).filter(Boolean)
        if (colorList.length > 0) {
          await supabase.from('product_colors').insert(colorList.map((c) => ({ product_id: productId!, color_name: c })))
        }
      }

      toast.success(product ? 'Product updated' : 'Product created')
      onSaved()
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Save failed')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-start justify-end" onClick={onClose}>
      <div className="bg-white w-full max-w-lg h-full overflow-y-auto shadow-xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-5 border-b border-gray-100 sticky top-0 bg-white">
          <h2 className="font-serif text-lg font-medium">{product ? 'Edit Product' : 'New Product'}</h2>
          <button onClick={onClose} className="font-sans text-sm text-gray-400 hover:text-ink">✕</button>
        </div>
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="font-sans text-xs text-gray-500 uppercase tracking-wider block mb-1.5">Name *</label>
            <input required className="input-field" value={form.name} onChange={(e) => up('name', e.target.value)} />
          </div>
          <div>
            <label className="font-sans text-xs text-gray-500 uppercase tracking-wider block mb-1.5">Description</label>
            <textarea className="input-field h-20 resize-none" value={form.description} onChange={(e) => up('description', e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="font-sans text-xs text-gray-500 uppercase tracking-wider block mb-1.5">Category</label>
              <select className="input-field" value={form.category_id} onChange={(e) => up('category_id', e.target.value)}>
                <option value="">None</option>
                {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="font-sans text-xs text-gray-500 uppercase tracking-wider block mb-1.5">Status</label>
              <select className="input-field" value={form.status} onChange={(e) => up('status', e.target.value)}>
                <option value="active">Active</option>
                <option value="draft">Draft</option>
                <option value="archived">Archived</option>
              </select>
            </div>
          </div>
          <div>
            <label className="font-sans text-xs text-gray-500 uppercase tracking-wider block mb-1.5">Fabric Composition</label>
            <input className="input-field" value={form.fabric_composition} onChange={(e) => up('fabric_composition', e.target.value)} placeholder="e.g. 100% Cotton" />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="font-sans text-xs text-gray-500 uppercase tracking-wider block mb-1.5">Weave Type</label>
              <input className="input-field" value={form.weave_type} onChange={(e) => up('weave_type', e.target.value)} placeholder="Plain" />
            </div>
            <div>
              <label className="font-sans text-xs text-gray-500 uppercase tracking-wider block mb-1.5">Width</label>
              <input className="input-field" value={form.width} onChange={(e) => up('width', e.target.value)} placeholder="44 inches" />
            </div>
            <div>
              <label className="font-sans text-xs text-gray-500 uppercase tracking-wider block mb-1.5">GSM</label>
              <input type="number" className="input-field" value={form.gsm} onChange={(e) => up('gsm', e.target.value)} placeholder="120" />
            </div>
          </div>
          <div>
            <label className="font-sans text-xs text-gray-500 uppercase tracking-wider block mb-1.5">Colors (comma-separated)</label>
            <input className="input-field" value={form.colors} onChange={(e) => up('colors', e.target.value)} placeholder="White, Navy, Ivory" />
          </div>

          {product && (
            <div>
              <label className="font-sans text-xs text-gray-500 uppercase tracking-wider block mb-1.5">Upload Images</label>
              <label className="flex items-center gap-2 btn-outline text-xs cursor-pointer w-fit">
                <Upload size={13} /> {imageUploading ? 'Uploading…' : 'Choose Images'}
                <input type="file" accept="image/*" multiple className="hidden" onChange={handleImageUpload} disabled={imageUploading} />
              </label>
              {product.product_images?.length > 0 && (
                <div className="flex gap-2 mt-2 flex-wrap">
                  {product.product_images.map((img) => (
                    <img key={img.id} src={img.image_url} alt="" className="w-14 h-14 object-cover border border-gray-100" />
                  ))}
                </div>
              )}
            </div>
          )}

          <div className="pt-2 flex gap-3">
            <button type="submit" disabled={saving} className="btn-primary flex-1">{saving ? 'Saving…' : (product ? 'Update Product' : 'Create Product')}</button>
            <button type="button" onClick={onClose} className="btn-outline">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  )
}
