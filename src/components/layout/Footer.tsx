import { Link } from 'react-router-dom'
import WovenIcon from '../ui/WovenIcon'

export default function Footer() {
  return (
    <footer className="bg-ink text-white mt-auto">
      <div className="container-brand py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 pb-12 border-b border-white/8">

          {/* Brand */}
          <div className="md:col-span-5">
            <div className="flex items-center gap-3 mb-5">
              <WovenIcon size={20} warpColor="white" weftColor="#C79A3E" />
              <div className="leading-none">
                <div className="font-serif text-base font-medium tracking-wide">NEMIDEEP</div>
                <div className="font-sans text-[8px] text-gold tracking-wide3 uppercase mt-0.5">weaves</div>
              </div>
            </div>
            <p className="font-sans text-[13px] text-white/45 leading-reading max-w-xs">
              Premium textile manufacturer and wholesale supplier. Direct from our mill in Surat, Gujarat — no retail, B2B trade only.
            </p>
          </div>

          {/* Links */}
          <div className="md:col-span-3 md:col-start-7">
            <h4 className="font-sans text-[9px] uppercase tracking-wide3 text-white/30 mb-5">Navigate</h4>
            <ul className="space-y-3">
              {[
                { to: '/catalog', label: 'Catalog' },
                { to: '/about', label: 'About Us' },
                { to: '/contact', label: 'Contact' },
                { to: '/signup', label: 'Become a Buyer' },
              ].map((l) => (
                <li key={l.to}>
                  <Link to={l.to} className="font-sans text-[13px] text-white/50 hover:text-white transition-colors duration-200">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="md:col-span-3">
            <h4 className="font-sans text-[9px] uppercase tracking-wide3 text-white/30 mb-5">Contact</h4>
            <address className="not-italic space-y-2 font-sans text-[13px] text-white/50">
              <p>Ring Road, Textile Market</p>
              <p>Surat, Gujarat — 395 002</p>
              <a href="tel:+919876543210" className="block hover:text-gold transition-colors duration-200 mt-3">
                +91 98765 43210
              </a>
              <a href="mailto:wholesale@nemideep.com" className="block hover:text-gold transition-colors duration-200">
                wholesale@nemideep.com
              </a>
            </address>
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="font-sans text-[11px] text-white/25">
            &copy; {new Date().getFullYear()} NEMIDEEP weaves. All rights reserved.
          </p>
          <p className="font-sans text-[11px] text-white/20 uppercase tracking-label">
            A NEMIDEEP Company
          </p>
        </div>
      </div>
    </footer>
  )
}
