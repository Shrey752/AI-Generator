import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { Menu, X, ShoppingBag, User, LogOut } from 'lucide-react'
import { useAuthStore } from '../../store/authStore'
import { useCartStore } from '../../store/cartStore'

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
    { to: '/', label: 'Home' },
    { to: '/catalog', label: 'Catalog' },
    { to: '/about', label: 'About' },
    { to: '/contact', label: 'Contact' },
  ]

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex flex-col leading-none">
            <span className="font-serif text-xl font-semibold text-ink tracking-wide">NEMIDEEP</span>
            <span className="font-sans text-xs text-gold tracking-[0.2em] uppercase">weaves</span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.to === '/'}
                className={({ isActive }) =>
                  `font-sans text-sm font-medium transition-colors duration-200 ${
                    isActive ? 'text-gold' : 'text-ink hover:text-gold'
                  }`
                }
              >
                {l.label}
              </NavLink>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-4">
            {!user ? (
              <>
                <Link to="/login" className="btn-ghost text-sm">Login</Link>
                <Link to="/signup" className="btn-primary text-sm">Sign Up</Link>
              </>
            ) : isAdmin ? (
              <>
                <Link to="/admin" className="btn-ghost text-sm flex items-center gap-1.5">
                  <User size={15} /> Admin
                </Link>
                <button onClick={handleSignOut} className="btn-ghost text-sm flex items-center gap-1.5">
                  <LogOut size={15} /> Sign Out
                </button>
              </>
            ) : (
              <>
                <Link to="/enquiry" className="relative btn-ghost text-sm flex items-center gap-1.5">
                  <ShoppingBag size={15} />
                  Enquiry
                  {items.length > 0 && (
                    <span className="absolute -top-1 -right-2 bg-gold text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">
                      {items.length}
                    </span>
                  )}
                </Link>
                <Link to="/dashboard" className="btn-ghost text-sm flex items-center gap-1.5">
                  <User size={15} /> Dashboard
                </Link>
                <button onClick={handleSignOut} className="btn-ghost text-sm flex items-center gap-1.5">
                  <LogOut size={15} /> Sign Out
                </button>
              </>
            )}
          </div>

          <button
            className="md:hidden p-2 text-ink"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 py-4 space-y-3">
          {navLinks.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.to === '/'}
              className={({ isActive }) =>
                `block font-sans text-sm font-medium py-1.5 ${isActive ? 'text-gold' : 'text-ink'}`
              }
              onClick={() => setMobileOpen(false)}
            >
              {l.label}
            </NavLink>
          ))}
          <div className="pt-2 border-t border-gray-100 space-y-2">
            {!user ? (
              <>
                <Link to="/login" className="block btn-ghost text-sm" onClick={() => setMobileOpen(false)}>Login</Link>
                <Link to="/signup" className="block btn-primary text-sm text-center" onClick={() => setMobileOpen(false)}>Sign Up</Link>
              </>
            ) : isAdmin ? (
              <>
                <Link to="/admin" className="block btn-ghost text-sm" onClick={() => setMobileOpen(false)}>Admin Dashboard</Link>
                <button onClick={() => { handleSignOut(); setMobileOpen(false) }} className="btn-ghost text-sm">Sign Out</button>
              </>
            ) : (
              <>
                <Link to="/enquiry" className="block btn-ghost text-sm" onClick={() => setMobileOpen(false)}>
                  Enquiry List {items.length > 0 && `(${items.length})`}
                </Link>
                <Link to="/dashboard" className="block btn-ghost text-sm" onClick={() => setMobileOpen(false)}>Dashboard</Link>
                <button onClick={() => { handleSignOut(); setMobileOpen(false) }} className="btn-ghost text-sm">Sign Out</button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
