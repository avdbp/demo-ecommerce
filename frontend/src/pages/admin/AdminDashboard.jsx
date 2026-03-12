import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'
import { fetchProducts, fetchOrders } from '../../services/api.js'

export default function AdminDashboard() {
  const navigate = useNavigate()
  const { logout } = useAuth()
  const [productsCount, setProductsCount] = useState(0)
  const [ordersCount, setOrdersCount] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([fetchProducts(), fetchOrders()])
      .then(([products, orders]) => {
        setProductsCount(products.length)
        setOrdersCount(orders.length)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <div className="flex min-h-screen">
      <aside className="w-64 bg-green-dark text-white p-6 flex flex-col">
        <Link to="/" className="font-playfair text-xl font-semibold mb-8 block text-white hover:text-green-light">
            Inicio
          </Link>
        <nav className="space-y-2 flex-1">
          <Link
            to="/admin/products"
            className="block py-2 text-green-light/90 hover:text-white transition-colors"
          >
            Productos
          </Link>
          <Link
            to="/admin/add-product"
            className="block py-2 text-green-light/90 hover:text-white transition-colors"
          >
            Añadir producto
          </Link>
          <Link
            to="/admin/offers"
            className="block py-2 text-green-light/90 hover:text-white transition-colors"
          >
            Ofertas
          </Link>
          <Link
            to="/admin/add-offer"
            className="block py-2 text-green-light/90 hover:text-white transition-colors"
          >
            Crear oferta
          </Link>
          <Link
            to="/admin/orders"
            className="block py-2 text-green-light/90 hover:text-white transition-colors"
          >
            Pedidos
          </Link>
        </nav>
        <button
          onClick={handleLogout}
          className="mt-4 py-2 text-green-light/90 hover:text-white transition-colors text-left"
        >
          Cerrar sesión
        </button>
      </aside>
      <main className="flex-1 p-8 bg-cream">
        <h1 className="font-playfair text-2xl font-bold text-charcoal mb-8">
          Panel de Administración
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-charcoal/70 text-sm font-medium mb-1">Total productos</h3>
            <p className="text-3xl font-bold text-green-mid">{loading ? '...' : productsCount}</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-charcoal/70 text-sm font-medium mb-1">Total pedidos</h3>
            <p className="text-3xl font-bold text-green-mid">{loading ? '...' : ordersCount}</p>
          </div>
        </div>
      </main>
    </div>
  )
}
