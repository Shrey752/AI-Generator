import { MapPin, Phone, Mail, Clock } from 'lucide-react'

export default function ContactPage() {
  return (
    <div>
      <section className="bg-ink text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="font-sans text-xs text-gold uppercase tracking-[0.3em] mb-3">Get in Touch</p>
          <h1 className="font-serif text-4xl md:text-5xl font-medium">Contact us</h1>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid md:grid-cols-2 gap-16">
          <div>
            <h2 className="section-title mb-4">We'd love to hear from you</h2>
            <div className="gold-divider" />
            <p className="font-sans text-sm text-gray-500 mt-4 mb-8 leading-relaxed">
              For trade enquiries, catalog questions, or to discuss your fabric requirements, reach out to us directly. All buyer registrations are handled online — use the Sign Up page to create your trade account.
            </p>
            <div className="space-y-5">
              {[
                {
                  icon: MapPin,
                  label: 'Address',
                  value: 'Ring Road, Textile Market, Surat, Gujarat — 395 002',
                },
                {
                  icon: Phone,
                  label: 'Phone',
                  value: '+91 98765 43210',
                  href: 'tel:+919876543210',
                },
                {
                  icon: Mail,
                  label: 'Email',
                  value: 'wholesale@nemideep.com',
                  href: 'mailto:wholesale@nemideep.com',
                },
                {
                  icon: Clock,
                  label: 'Hours',
                  value: 'Mon–Sat, 10 AM – 6 PM IST',
                },
              ].map(({ icon: Icon, label, value, href }) => (
                <div key={label} className="flex gap-4">
                  <div className="w-10 h-10 border border-gold/30 flex items-center justify-center flex-shrink-0">
                    <Icon size={16} className="text-gold" />
                  </div>
                  <div>
                    <div className="font-sans text-xs text-gray-400 uppercase tracking-wider mb-0.5">{label}</div>
                    {href ? (
                      <a href={href} className="font-sans text-sm text-ink hover:text-gold transition-colors">{value}</a>
                    ) : (
                      <p className="font-sans text-sm text-ink">{value}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gray-50 p-8">
            <h3 className="font-serif text-2xl font-medium mb-2">For trade buyers</h3>
            <div className="gold-divider" />
            <p className="font-sans text-sm text-gray-500 mt-4 leading-relaxed">
              We don't publish prices on our website. Once you sign up and submit an enquiry, our team will call you within 24 hours to discuss your requirements and provide a personalised quote.
            </p>
            <div className="mt-6 space-y-3">
              <div className="flex gap-3 items-start">
                <span className="w-6 h-6 rounded-full bg-gold text-white font-sans text-xs flex items-center justify-center flex-shrink-0 mt-0.5">1</span>
                <p className="font-sans text-sm text-gray-600">Create a free trade account</p>
              </div>
              <div className="flex gap-3 items-start">
                <span className="w-6 h-6 rounded-full bg-gold text-white font-sans text-xs flex items-center justify-center flex-shrink-0 mt-0.5">2</span>
                <p className="font-sans text-sm text-gray-600">Browse the catalog and add products to your enquiry list</p>
              </div>
              <div className="flex gap-3 items-start">
                <span className="w-6 h-6 rounded-full bg-gold text-white font-sans text-xs flex items-center justify-center flex-shrink-0 mt-0.5">3</span>
                <p className="font-sans text-sm text-gray-600">Submit your enquiry — we call you with personalised pricing</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
