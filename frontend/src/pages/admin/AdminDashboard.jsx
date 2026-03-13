import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import AdminLayout from '../../components/AdminLayout.jsx'
import { fetchProducts, fetchOrders } from '../../services/api.js'

export default function AdminDashboard() {
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

  return (
    <AdminLayout title="Panel de Administración">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Link to="/admin/products" className="bg-white rounded-xl shadow-card p-6 hover:shadow-card-hover transition-shadow">
          <h3 className="text-neutral-500 text-sm font-medium mb-1">Total productos</h3>
          <p className="text-3xl font-bold text-primary-600">{loading ? '...' : productsCount}</p>
          <p className="text-sm text-primary-600 mt-2">Ver inventario →</p>
        </Link>
        <Link to="/admin/add-product" className="bg-white rounded-xl shadow-card p-6 hover:shadow-card-hover transition-shadow">
          <h3 className="text-neutral-500 text-sm font-medium mb-1">Añadir producto</h3>
          <p className="text-primary-600 font-medium mt-2">Crear planta o ramo →</p>
        </Link>
        <Link to="/admin/offers" className="bg-white rounded-xl shadow-card p-6 hover:shadow-card-hover transition-shadow">
          <h3 className="text-neutral-500 text-sm font-medium mb-1">Ofertas</h3>
          <p className="text-primary-600 font-medium mt-2">Gestionar ofertas →</p>
        </Link>
        <Link to="/admin/orders" className="bg-white rounded-xl shadow-card p-6 hover:shadow-card-hover transition-shadow">
          <h3 className="text-neutral-500 text-sm font-medium mb-1">Total pedidos</h3>
          <p className="text-3xl font-bold text-primary-600">{loading ? '...' : ordersCount}</p>
          <p className="text-sm text-primary-600 mt-2">Ver pedidos →</p>
        </Link>
      </div>
    </AdminLayout>
  )
}
