import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { useCart } from '../context/CartContext.jsx'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { isLoggedIn, isAdmin, logout } = useAuth()
  const { cartCount } = useCart()

  const handleScroll = () => {
    setScrolled(window.scrollY > 20)
  }

  useEffect(() => {
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-white shadow-md' : 'bg-white/95 backdrop-blur-sm'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 md:h-20">
          <Link to="/" className="font-playfair text-2xl md:text-3xl font-semibold text-green-dark">
            Floristería
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <Link to="/plantas" className="text-charcoal hover:text-green-mid transition-colors">
              Plantas
            </Link>
            <Link to="/flores" className="text-charcoal hover:text-green-mid transition-colors">
              Flores
            </Link>
            {isLoggedIn ? (
              <>
                {isAdmin ? (
                  <Link to="/admin" className="text-charcoal hover:text-green-mid transition-colors">
                    Administración
                  </Link>
                ) : (
                  <Link to="/profile" className="text-charcoal hover:text-green-mid transition-colors">
                    Perfil
                  </Link>
                )}
                <button onClick={logout} className="text-charcoal hover:text-green-mid transition-colors">
                  Cerrar sesión
                </button>
              </>
            ) : (
              <Link to="/login" className="text-charcoal hover:text-green-mid transition-colors">
                Iniciar sesión
              </Link>
            )}
            <Link to="/cart" className="relative p-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-charcoal hover:text-green-mid transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-green-mid text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>

          <div className="md:hidden flex items-center gap-4">
            <Link to="/cart" className="relative p-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-charcoal" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-green-mid text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 text-charcoal hover:text-green-mid"
              aria-label="Menu"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {isOpen && (
          <div className="md:hidden py-4 border-t border-gray-100">
            <div className="flex flex-col gap-4">
              <Link to="/plantas" className="text-charcoal hover:text-green-mid" onClick={() => setIsOpen(false)}>
                Plantas
              </Link>
              <Link to="/flores" className="text-charcoal hover:text-green-mid" onClick={() => setIsOpen(false)}>
                Flores
              </Link>
              {isLoggedIn ? (
                <>
                  {isAdmin ? (
                    <Link to="/admin" className="text-charcoal hover:text-green-mid" onClick={() => setIsOpen(false)}>
                      Administración
                    </Link>
                  ) : (
                    <Link to="/profile" className="text-charcoal hover:text-green-mid" onClick={() => setIsOpen(false)}>
                      Perfil
                    </Link>
                  )}
                  <button onClick={() => { logout(); setIsOpen(false); }} className="text-charcoal hover:text-green-mid text-left">
                    Cerrar sesión
                  </button>
                </>
              ) : (
                <Link to="/login" className="text-charcoal hover:text-green-mid" onClick={() => setIsOpen(false)}>
                  Iniciar sesión
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
