import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Lock, ShoppingBag, Check, X, ZoomIn } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { useAuthStore } from '../../store/authStore'
import { useCartStore } from '../../store/cartStore'
import type { ProductFull } from '../../types/database'
import Spinner from '../../components/ui/Spinner'

export default function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const [product, setProduct] = useState<ProductFull | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeImage, setActiveImage] = useState(0)
  const [lightbox, setLightbox] = useState(false)

  const { user, isAdmin } = useAuthStore()
  const { addItem, hasItem } = useCartStore()

  useEffect(() => {
    async function load() {
      if (!slug) return
      const { data } = await supabase
        .from('products')
        .select('*, categories(*), product_colors(*), product_images(*)')
        .eq('slug', slug)
        .eq('status', 'active')
        .single()
      setProduct(data as unknown as ProductFull)
      setLoading(false)
    }
    load()
  }, [slug])

  if (loading) return <div className="flex justify-center py-40"><Spinner /></div>
  if (!product) return (
    <div className="text-center py-40">
      <p className="font-sans text-gray-400">Product not found.</p>
      <Link to="/catalog" className="btn-outline mt-4 inline-block">Back to Catalog</Link>
    </div>
  )

  const images = product.product_images?.sort((a, b) => a.sort_order - b.sort_order) ?? []
  const inCart = hasItem(product.id)

  const specs = [
    { label: 'Composition', value: product.fabric_composition },
    { label: 'Weave', value: product.weave_type },
    { label: 'Width', value: product.width },
    { label: 'GSM', value: product.gsm?.toString() },
    { label: 'Category', value: product.categories?.name },
  ].filter((s) => s.value)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <Link to="/catalog" className="inline-flex items-center gap-2 font-sans text-sm text-gray-400 hover:text-gold transition-colors mb-8">
        <ArrowLeft size={15} /> Back to Catalog
      </Link>

      <div className="grid md:grid-cols-2 gap-12">
        {/* Images */}
        <div>
          <div
            className="aspect-[3/4] overflow-hidden bg-gray-100 cursor-zoom-in relative"
            onClick={() => setLightbox(true)}
          >
            {images[activeImage] ? (
              <img src={images[activeImage].image_url} alt={product.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-300 font-sans text-sm">No image</div>
            )}
            {images.length > 0 && (
              <div className="absolute bottom-3 right-3 bg-black/50 text-white p-1.5 rounded">
                <ZoomIn size={14} />
              </div>
            )}
          </div>
          {images.length > 1 && (
            <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
              {images.map((img, i) => (
                <button
                  key={img.id}
                  onClick={() => setActiveImage(i)}
                  className={`flex-shrink-0 w-16 h-20 overflow-hidden border-2 transition-colors ${activeImage === i ? 'border-gold' : 'border-gray-100'}`}
                >
                  <img src={img.image_url} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div>
          {product.categories && (
            <p className="font-sans text-xs text-gold uppercase tracking-widest mb-2">{product.categories.name}</p>
          )}
          <h1 className="font-serif text-3xl md:text-4xl font-medium text-ink mb-2">{product.name}</h1>
          <div className="gold-divider" />

          {product.description && (
            <p className="font-sans text-sm text-gray-600 leading-relaxed mt-4 mb-6">{product.description}</p>
          )}

          {/* Specs */}
          {specs.length > 0 && (
            <div className="border border-gray-100 divide-y divide-gray-100 mb-6">
              {specs.map((s) => (
                <div key={s.label} className="flex py-2.5 px-4 gap-4">
                  <span className="font-sans text-xs text-gray-400 uppercase tracking-wider w-24 flex-shrink-0">{s.label}</span>
                  <span className="font-sans text-sm text-ink">{s.value}</span>
                </div>
              ))}
            </div>
          )}

          {/* Colors */}
          {product.product_colors?.length > 0 && (
            <div className="mb-6">
              <p className="font-sans text-xs text-gray-400 uppercase tracking-wider mb-2">Available Colors</p>
              <div className="flex flex-wrap gap-2">
                {product.product_colors.map((c) => (
                  <div key={c.id} className="flex items-center gap-1.5 border border-gray-100 px-2.5 py-1">
                    {c.color_hex && (
                      <div className="w-3 h-3 rounded-full border border-gray-200" style={{ backgroundColor: c.color_hex }} />
                    )}
                    <span className="font-sans text-xs text-gray-600">{c.color_name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Enquire CTA */}
          <div className="mt-6">
            {!user || isAdmin ? (
              <div className="space-y-3">
                <Link to="/login" className="flex items-center justify-center gap-2 w-full btn-primary py-3">
                  <Lock size={15} /> Login to Enquire
                </Link>
                <p className="font-sans text-xs text-gray-400 text-center">
                  No account?{' '}
                  <Link to="/signup" className="text-gold hover:underline">Register as a trade buyer</Link>
                </p>
              </div>
            ) : inCart ? (
              <div className="flex items-center justify-center gap-2 w-full bg-gold/10 border border-gold py-3 font-sans text-sm text-gold">
                <Check size={16} /> Added to your enquiry list
              </div>
            ) : (
              <button
                onClick={() => addItem(product)}
                className="flex items-center justify-center gap-2 w-full btn-primary py-3"
              >
                <ShoppingBag size={15} /> Add to Enquiry List
              </button>
            )}

            <div className="mt-4 p-4 bg-gray-50 border-l-2 border-gold">
              <p className="font-sans text-xs text-gray-500 leading-relaxed">
                <strong className="text-ink">No prices listed.</strong> Add products to your enquiry list and submit — our team calls you within 24 hours with personalised wholesale pricing.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Lightbox */}
      {lightbox && images[activeImage] && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setLightbox(false)}
        >
          <button className="absolute top-4 right-4 text-white p-2 hover:text-gold">
            <X size={24} />
          </button>
          <img
            src={images[activeImage].image_url}
            alt={product.name}
            className="max-w-full max-h-full object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  )
}
