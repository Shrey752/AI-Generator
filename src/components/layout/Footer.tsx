import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="bg-ink text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div>
            <div className="mb-4">
              <div className="font-serif text-xl font-semibold tracking-wide">NEMIDEEP</div>
              <div className="font-sans text-xs text-gold tracking-[0.2em] uppercase">weaves</div>
            </div>
            <p className="font-sans text-sm text-gray-400 leading-relaxed">
              Premium textile manufacturer and wholesale supplier serving trade buyers across India.
            </p>
          </div>

          <div>
            <h4 className="font-sans text-sm font-semibold uppercase tracking-widest text-gray-300 mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {[
                { to: '/catalog', label: 'Catalog' },
                { to: '/about', label: 'About Us' },
                { to: '/contact', label: 'Contact' },
                { to: '/signup', label: 'Become a Buyer' },
              ].map((l) => (
                <li key={l.to}>
                  <Link to={l.to} className="font-sans text-sm text-gray-400 hover:text-gold transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-sans text-sm font-semibold uppercase tracking-widest text-gray-300 mb-4">Contact</h4>
            <address className="not-italic space-y-1.5 font-sans text-sm text-gray-400">
              <p>NEMIDEEP weaves</p>
              <p>Textile Market, Surat, Gujarat</p>
              <a href="tel:+919876543210" className="block hover:text-gold transition-colors">+91 98765 43210</a>
              <a href="mailto:wholesale@nemideep.com" className="block hover:text-gold transition-colors">wholesale@nemideep.com</a>
            </address>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-gray-800 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="font-sans text-xs text-gray-500">
            &copy; {new Date().getFullYear()} NEMIDEEP weaves. All rights reserved.
          </p>
          <p className="font-sans text-xs text-gray-600">A NEMIDEEP company</p>
        </div>
      </div>
    </footer>
  )
}
