import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { useCart } from '../context/CartContext.jsx'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const { isLoggedIn, isAdmin, logout } = useAuth()
  const { cartCount } = useCart()

  const navLink = "text-neutral-600 hover:text-primary-600 font-medium transition-colors"

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-neutral-200 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex justify-between items-center py-3 min-h-[4rem]">
          <Link to="/" className="block">
            <span className="font-sans text-3xl md:text-4xl font-bold text-neutral-900 leading-tight block">
              Floristería Roquetes
            </span>
            <span className="font-sans text-xs md:text-sm text-neutral-500 font-medium block -mt-0.5">
              Demo Ecommerce
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <Link to="/plantas" className={navLink}>Plantas</Link>
            <Link to="/flores" className={navLink}>Flores</Link>
            {isLoggedIn ? (
              <>
                {isAdmin && <Link to="/admin" className={navLink}>Admin</Link>}
                <Link to="/profile" className={navLink}>Perfil</Link>
                <button onClick={logout} className={navLink}>Salir</button>
              </>
            ) : (
              <Link to="/login" className={navLink}>Entrar</Link>
            )}
            <Link
              to={isLoggedIn ? '/cart' : { pathname: '/login', state: { from: '/cart' } }}
              className="relative p-2 text-neutral-600 hover:text-primary-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 bg-primary-500 text-white text-xs font-semibold rounded-full w-5 h-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>

          <div className="md:hidden flex items-center gap-2">
            <Link
              to={isLoggedIn ? '/cart' : { pathname: '/login', state: { from: '/cart' } }}
              className="relative p-2"
            >
              <svg className="w-6 h-6 text-neutral-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 bg-primary-500 text-white text-xs font-semibold rounded-full w-5 h-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 text-neutral-600"
              aria-label="Menu"
            >
              {isOpen ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {isOpen && (
          <div className="md:hidden py-4 border-t border-neutral-200 space-y-2">
            <Link to="/plantas" className="block py-2 text-neutral-600 font-medium" onClick={() => setIsOpen(false)}>Plantas</Link>
            <Link to="/flores" className="block py-2 text-neutral-600 font-medium" onClick={() => setIsOpen(false)}>Flores</Link>
            {isLoggedIn ? (
              <>
                {isAdmin && <Link to="/admin" className="block py-2 text-neutral-600 font-medium" onClick={() => setIsOpen(false)}>Admin</Link>}
                <Link to="/profile" className="block py-2 text-neutral-600 font-medium" onClick={() => setIsOpen(false)}>Perfil</Link>
                <button onClick={() => { logout(); setIsOpen(false); }} className="block py-2 text-neutral-600 font-medium text-left w-full">Salir</button>
              </>
            ) : (
              <Link to="/login" className="block py-2 text-neutral-600 font-medium" onClick={() => setIsOpen(false)}>Entrar</Link>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}
