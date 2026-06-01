import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'

export default function AboutPage() {
  return (
    <div>
      <section className="bg-ink text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="font-sans text-xs text-gold uppercase tracking-[0.3em] mb-3">About Us</p>
          <h1 className="font-serif text-4xl md:text-5xl font-medium max-w-xl">
            Heritage craftsmanship for modern trade.
          </h1>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid md:grid-cols-2 gap-16 items-start">
          <div>
            <h2 className="section-title mb-4">Who we are</h2>
            <div className="gold-divider" />
            <div className="mt-6 space-y-4 font-sans text-sm text-gray-600 leading-relaxed">
              <p>
                NEMIDEEP weaves is a textile manufacturing and wholesale company based in Surat, Gujarat — the fabric capital of India. We operate our own looms and finishing units, allowing us to maintain complete control over quality from yarn to finished fabric.
              </p>
              <p>
                We serve an exclusive trade clientele: tailors, garment manufacturers, fashion designers, and fabric retailers who demand consistency, honest provenance, and direct manufacturer relationships.
              </p>
              <p>
                By keeping the sales process personal — every enquiry is quoted over a phone call — we ensure buyers get fair pricing and the right recommendations for their specific projects.
              </p>
            </div>
          </div>
          <div className="space-y-6">
            <div className="aspect-video overflow-hidden bg-gray-100">
              <img
                src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80"
                alt="Loom at NEMIDEEP weaves"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
            <div className="grid grid-cols-3 gap-4 text-center">
              {[
                { stat: '15+', label: 'Years of weaving' },
                { stat: '200+', label: 'Fabric SKUs' },
                { stat: '500+', label: 'Trade buyers' },
              ].map((s) => (
                <div key={s.label} className="border border-gray-100 p-4">
                  <div className="font-serif text-2xl font-semibold text-gold">{s.stat}</div>
                  <div className="font-sans text-xs text-gray-500 mt-1">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="section-title text-center mb-2">Our values</h2>
          <div className="gold-divider mx-auto" />
          <div className="grid sm:grid-cols-3 gap-8 mt-10">
            {[
              { title: 'Transparency', desc: 'No hidden margins. We quote honestly based on volume, not on who you are.' },
              { title: 'Consistency', desc: 'Every order ships from the same looms. Repeat orders match your samples.' },
              { title: 'Relationships', desc: 'Every buyer has our direct number. We answer calls and keep commitments.' },
            ].map((v) => (
              <div key={v.title} className="text-center p-6">
                <div className="w-10 h-0.5 bg-gold mx-auto mb-4" />
                <h3 className="font-serif text-xl font-medium mb-3">{v.title}</h3>
                <p className="font-sans text-sm text-gray-500 leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <h2 className="section-title mb-4">Start sourcing with us</h2>
          <p className="font-sans text-sm text-gray-500 mb-8">Register for a free trade account to browse our catalog and submit enquiries.</p>
          <Link to="/signup" className="btn-primary inline-flex items-center gap-2">
            Create Trade Account <ArrowRight size={15} />
          </Link>
        </div>
      </section>
    </div>
  )
}
