import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { Menu, X, ShoppingBag } from 'lucide-react'
import { useAuthStore } from '../../store/authStore'
import { useCartStore } from '../../store/cartStore'
import WovenIcon from '../ui/WovenIcon'

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const { user, isAdmin, signOut } = useAuthStore()
  const items = useCartStore((s) => s.items)
  const navigate = useNavigate()

  const handleSignOut = async () => {
    await signOut()
    navigate('/')
  }

  const navLinks = [
    { to: '/catalog', label: 'Catalog' },
    { to: '/about', label: 'About' },
    { to: '/contact', label: 'Contact' },
  ]

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `font-sans text-[11px] uppercase tracking-label transition-colors duration-200 ${
      isActive ? 'text-gold' : 'text-muted hover:text-ink'
    }`

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-warm-border">
      <div className="container-brand">
        <div className="flex items-center justify-between h-18">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group" aria-label="NEMIDEEP weaves — home">
            <WovenIcon size={22} />
            <div className="leading-none">
              <div className="font-serif text-[17px] font-medium text-ink tracking-wide group-hover:text-gold transition-colors duration-200">
                NEMIDEEP
              </div>
              <div className="font-sans text-[8px] text-gold tracking-wide3 uppercase mt-0.5">
                weaves
              </div>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-10">
            {navLinks.map((l) => (
              <NavLink key={l.to} to={l.to} className={linkClass}>
                {l.label}
              </NavLink>
            ))}
          </nav>

          {/* Desktop auth / actions */}
          <div className="hidden md:flex items-center gap-6">
            {!user ? (
              <>
                <Link to="/login" className="btn-ghost">Login</Link>
                <Link to="/signup" className="btn-outline-ink py-2.5 px-6">Register</Link>
              </>
            ) : isAdmin ? (
              <>
                <Link to="/admin" className="btn-ghost">Dashboard</Link>
                <button onClick={handleSignOut} className="btn-ghost">Sign Out</button>
              </>
            ) : (
              <>
                <Link to="/enquiry" className="relative flex items-center gap-2 btn-ghost">
                  <ShoppingBag size={14} strokeWidth={1.5} />
                  Enquiry
                  {items.length > 0 && (
                    <span className="absolute -top-1.5 -right-2 w-4 h-4 bg-gold text-white text-[9px] flex items-center justify-center rounded-full font-medium">
                      {items.length}
                    </span>
                  )}
                </Link>
                <Link to="/dashboard" className="btn-ghost">Account</Link>
                <button onClick={handleSignOut} className="btn-ghost">Sign Out</button>
              </>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 -mr-2 text-ink"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle navigation"
          >
            {mobileOpen ? <X size={20} strokeWidth={1.5} /> : <Menu size={20} strokeWidth={1.5} />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="md:hidden border-t border-warm-border bg-white">
          <div className="container-brand py-6 space-y-1">
            {navLinks.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                className={({ isActive }) =>
                  `block font-sans text-[11px] uppercase tracking-label py-2.5 border-b border-warm-border/50 ${
                    isActive ? 'text-gold' : 'text-muted'
                  }`
                }
                onClick={() => setMobileOpen(false)}
              >
                {l.label}
              </NavLink>
            ))}
            <div className="pt-4 space-y-3">
              {!user ? (
                <>
                  <Link to="/login" onClick={() => setMobileOpen(false)} className="block font-sans text-[11px] uppercase tracking-label text-muted py-2">
                    Login
                  </Link>
                  <Link to="/signup" onClick={() => setMobileOpen(false)} className="btn-outline-ink w-full text-center">
                    Register
                  </Link>
                </>
              ) : isAdmin ? (
                <>
                  <Link to="/admin" onClick={() => setMobileOpen(false)} className="block btn-ghost py-2">Admin Dashboard</Link>
                  <button onClick={() => { handleSignOut(); setMobileOpen(false) }} className="block btn-ghost py-2">Sign Out</button>
                </>
              ) : (
                <>
                  <Link to="/enquiry" onClick={() => setMobileOpen(false)} className="block btn-ghost py-2">
                    Enquiry List {items.length > 0 && `(${items.length})`}
                  </Link>
                  <Link to="/dashboard" onClick={() => setMobileOpen(false)} className="block btn-ghost py-2">Account</Link>
                  <button onClick={() => { handleSignOut(); setMobileOpen(false) }} className="block btn-ghost py-2">Sign Out</button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
