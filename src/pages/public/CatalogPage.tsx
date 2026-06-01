import { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { SlidersHorizontal, Lock, ShoppingBag, Check } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { useAuthStore } from '../../store/authStore'
import { useCartStore } from '../../store/cartStore'
import type { ProductFull, Category } from '../../types/database'
import Spinner from '../../components/ui/Spinner'

export default function CatalogPage() {
  const [products, setProducts] = useState<ProductFull[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [searchParams, setSearchParams] = useSearchParams()

  const { user, isAdmin } = useAuthStore()
  const { addItem, hasItem } = useCartStore()

  const selectedCategory = searchParams.get('category') ?? ''

  useEffect(() => {
    async function load() {
      setLoading(true)
      const [catRes, prodRes] = await Promise.all([
        supabase.from('categories').select('*').order('name'),
        supabase
          .from('products')
          .select('*, categories(*), product_colors(*), product_images(*)')
          .eq('status', 'active')
          .order('created_at', { ascending: false }),
      ])
      if (catRes.data) setCategories(catRes.data)
      if (prodRes.data) setProducts(prodRes.data as ProductFull[])
      setLoading(false)
    }
    load()
  }, [])

  const filtered = selectedCategory
    ? products.filter((p) => p.categories?.slug === selectedCategory)
    : products

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="section-title">Fabric Catalog</h1>
          <div className="gold-divider" />
        </div>
        <button
          onClick={() => setFiltersOpen(!filtersOpen)}
          className="md:hidden flex items-center gap-2 btn-outline text-sm"
        >
          <SlidersHorizontal size={15} /> Filters
        </button>
      </div>

      <div className="flex gap-8">
        {/* Sidebar filters */}
        <aside className={`${filtersOpen ? 'block' : 'hidden'} md:block w-48 flex-shrink-0`}>
          <h3 className="font-sans text-xs uppercase tracking-widest text-gray-400 mb-3">Category</h3>
          <ul className="space-y-1">
            <li>
              <button
                onClick={() => setSearchParams({})}
                className={`font-sans text-sm w-full text-left py-1.5 px-2 transition-colors ${!selectedCategory ? 'text-gold font-medium' : 'text-gray-600 hover:text-ink'}`}
              >
                All Fabrics
              </button>
            </li>
            {categories.map((cat) => (
              <li key={cat.id}>
                <button
                  onClick={() => setSearchParams({ category: cat.slug })}
                  className={`font-sans text-sm w-full text-left py-1.5 px-2 transition-colors ${selectedCategory === cat.slug ? 'text-gold font-medium' : 'text-gray-600 hover:text-ink'}`}
                >
                  {cat.name}
                </button>
              </li>
            ))}
          </ul>
        </aside>

        {/* Grid */}
        <div className="flex-1 min-w-0">
          {loading ? (
            <div className="flex justify-center py-20"><Spinner /></div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20">
              <p className="font-sans text-gray-400">No products found.</p>
            </div>
          ) : (
            <>
              <p className="font-sans text-xs text-gray-400 mb-5">{filtered.length} products</p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                {filtered.map((product) => {
                  const image = product.product_images?.[0]?.image_url
                  const inCart = hasItem(product.id)
                  return (
                    <div key={product.id} className="group border border-gray-100 hover:border-gold hover:shadow-md transition-all duration-200">
                      <Link to={`/catalog/${product.slug}`}>
                        <div className="aspect-[3/4] overflow-hidden bg-gray-100">
                          {image ? (
                            <img src={image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-300 font-sans text-xs">No image</div>
                          )}
                        </div>
                        <div className="p-3">
                          <p className="font-sans text-xs text-gold uppercase tracking-widest mb-1">{product.categories?.name}</p>
                          <h3 className="font-serif text-base font-medium text-ink leading-snug">{product.name}</h3>
                          {product.fabric_composition && (
                            <p className="font-sans text-xs text-gray-400 mt-1">{product.fabric_composition}</p>
                          )}
                        </div>
                      </Link>
                      <div className="px-3 pb-3">
                        {!user || isAdmin ? (
                          <Link to="/login" className="flex items-center justify-center gap-2 w-full border border-gray-200 py-2 font-sans text-xs text-gray-500 hover:border-gold hover:text-gold transition-colors">
                            <Lock size={12} /> Login to enquire
                          </Link>
                        ) : inCart ? (
                          <div className="flex items-center justify-center gap-2 w-full bg-gold/10 border border-gold py-2 font-sans text-xs text-gold">
                            <Check size={12} /> Added to enquiry
                          </div>
                        ) : (
                          <button
                            onClick={() => addItem(product)}
                            className="flex items-center justify-center gap-2 w-full bg-gold text-white py-2 font-sans text-xs hover:bg-gold-dark transition-colors"
                          >
                            <ShoppingBag size={12} /> Add to enquiry
                          </button>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
