import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

const navLink = "block py-2 text-primary-200 hover:text-white transition-colors"
const navLinkActive = "block py-2 text-white font-medium"

export default function AdminLayout({ children, title }) {
  const navigate = useNavigate()
  const location = useLocation()
  const { logout } = useAuth()

  const isActive = (path) => {
    if (path === '/admin') return location.pathname === '/admin'
    return location.pathname === path || location.pathname.startsWith(path + '/')
  }

  return (
    <div className="flex min-h-screen">
      <aside className="w-64 bg-primary-800 text-white p-6 flex flex-col shrink-0">
        <Link to="/admin" className="text-xl font-bold mb-8 block text-white hover:text-primary-200 transition-colors">
          Panel Admin
        </Link>
        <nav className="space-y-1 flex-1">
          <Link to="/admin" className={isActive('/admin') && location.pathname === '/admin' ? navLinkActive : navLink}>
            Dashboard
          </Link>
          <Link to="/admin/products" className={isActive('/admin/products') ? navLinkActive : navLink}>
            Productos
          </Link>
          <Link to="/admin/add-product" className={isActive('/admin/add-product') ? navLinkActive : navLink}>
            Añadir producto
          </Link>
          <Link to="/admin/offers" className={isActive('/admin/offers') && !isActive('/admin/add-offer') && !isActive('/admin/edit-offer') ? navLinkActive : navLink}>
            Ofertas
          </Link>
          <Link to="/admin/add-offer" className={isActive('/admin/add-offer') ? navLinkActive : navLink}>
            Crear oferta
          </Link>
          <Link to="/admin/orders" className={isActive('/admin/orders') ? navLinkActive : navLink}>
            Pedidos
          </Link>
        </nav>
        <div className="pt-4 border-t border-primary-600">
          <Link to="/" className="block py-2 text-primary-200 hover:text-white transition-colors text-sm">
            Ver tienda
          </Link>
          <button
            onClick={() => { logout(); navigate('/'); }}
            className="block py-2 text-primary-200 hover:text-white transition-colors text-left text-sm"
          >
            Cerrar sesión
          </button>
        </div>
      </aside>
      <main className="flex-1 p-8 bg-neutral-50 overflow-x-auto min-w-0">
        {title && (
          <h1 className="text-2xl font-bold text-neutral-900 mb-8">{title}</h1>
        )}
        {children}
      </main>
    </div>
  )
}
