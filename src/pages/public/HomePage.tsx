import { Link } from 'react-router-dom'
import { ArrowRight, CheckCircle } from 'lucide-react'

const categories = [
  { name: 'Cotton', description: 'Breathable everyday weaves', slug: 'cotton', emoji: '🌿' },
  { name: 'Silk', description: 'Lustrous heritage fabrics', slug: 'silk', emoji: '✨' },
  { name: 'Linen', description: 'Natural textured weaves', slug: 'linen', emoji: '🌾' },
  { name: 'Blends', description: 'Curated fabric combinations', slug: 'blends', emoji: '🎨' },
]

const benefits = [
  'Direct from manufacturer — no middlemen',
  'MOQ flexible for trade buyers',
  'Custom colorways available',
  'Pan-India delivery',
]

export default function HomePage() {
  return (
    <div>
      {/* Hero */}
      <section className="relative bg-ink text-white overflow-hidden">
        <div className="absolute inset-0 opacity-20"
          style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1400&q=80)', backgroundSize: 'cover', backgroundPosition: 'center' }}
        />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-28 md:py-40">
          <div className="max-w-2xl">
            <p className="font-sans text-xs text-gold uppercase tracking-[0.3em] mb-4">Premium B2B Wholesale</p>
            <h1 className="font-serif text-4xl md:text-6xl font-medium leading-tight mb-6">
              Fabrics woven<br />with purpose.
            </h1>
            <p className="font-sans text-base text-gray-300 leading-relaxed mb-8 max-w-lg">
              NEMIDEEP weaves supplies premium textiles to tailors, designers, garment makers, and retailers across India. Trade enquiries only — no retail.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/catalog" className="bg-gold text-white px-8 py-3 font-sans font-medium text-sm tracking-wide hover:bg-gold-dark transition-colors flex items-center gap-2">
                Browse Catalog <ArrowRight size={16} />
              </Link>
              <Link to="/signup" className="border border-white/40 text-white px-8 py-3 font-sans font-medium text-sm tracking-wide hover:border-gold hover:text-gold transition-colors">
                Register as Buyer
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits strip */}
      <section className="bg-gold/10 border-y border-gold/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-2">
            {benefits.map((b) => (
              <div key={b} className="flex items-center gap-2 font-sans text-sm text-ink">
                <CheckCircle size={14} className="text-gold flex-shrink-0" />
                {b}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-12">
          <h2 className="section-title mb-3">Our Fabric Range</h2>
          <div className="gold-divider mx-auto" />
          <p className="font-sans text-sm text-gray-500 mt-3 max-w-lg mx-auto">
            From heritage silks to everyday cottons — explore our curated collection of wholesale textiles.
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              to={`/catalog?category=${cat.slug}`}
              className="group border border-gray-100 p-6 hover:border-gold hover:shadow-md transition-all duration-200 text-center"
            >
              <div className="text-4xl mb-3">{cat.emoji}</div>
              <h3 className="font-serif text-lg font-medium text-ink group-hover:text-gold transition-colors">{cat.name}</h3>
              <p className="font-sans text-xs text-gray-500 mt-1">{cat.description}</p>
            </Link>
          ))}
        </div>
        <div className="text-center mt-8">
          <Link to="/catalog" className="btn-outline inline-flex items-center gap-2">
            View Full Catalog <ArrowRight size={15} />
          </Link>
        </div>
      </section>

      {/* Brand story */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <p className="font-sans text-xs text-gold uppercase tracking-[0.3em] mb-3">Our Story</p>
              <h2 className="section-title mb-4">Craftsmanship meets<br />commerce.</h2>
              <div className="gold-divider" />
              <p className="font-sans text-sm text-gray-600 leading-relaxed mt-4 mb-6">
                NEMIDEEP weaves was founded to bridge the gap between skilled textile artisans and the trade buyers who rely on quality fabrics. We manufacture in-house and sell wholesale — ensuring consistency, fair pricing, and direct accountability.
              </p>
              <Link to="/about" className="btn-outline inline-flex items-center gap-2">
                Our Story <ArrowRight size={15} />
              </Link>
            </div>
            <div className="aspect-[4/3] overflow-hidden bg-gray-200">
              <img
                src="https://images.unsplash.com/photo-1586495777744-4e6232bf2263?w=800&q=80"
                alt="Textile manufacturing"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-ink text-white py-16">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="font-serif text-3xl md:text-4xl font-medium mb-4">Ready to source premium fabrics?</h2>
          <p className="font-sans text-sm text-gray-400 mb-8">
            Create a free trade account to access our full catalog and submit enquiries. We call you with pricing — no listed prices, just honest wholesale rates.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/signup" className="bg-gold text-white px-8 py-3 font-sans font-medium text-sm tracking-wide hover:bg-gold-dark transition-colors">
              Create Trade Account
            </Link>
            <Link to="/contact" className="border border-white/30 text-white px-8 py-3 font-sans font-medium text-sm hover:border-gold hover:text-gold transition-colors">
              Get in Touch
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
