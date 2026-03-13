import { useState, useEffect } from 'react'
import AdminLayout from '../../components/AdminLayout.jsx'
import { fetchOrders } from '../../services/api.js'

export default function AdminOrders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchOrders()
      .then(setOrders)
      .catch(() => setOrders([]))
      .finally(() => setLoading(false))
  }, [])

  return (
    <AdminLayout title="Pedidos">
      {loading ? (
        <p className="text-neutral-600">Cargando pedidos...</p>
      ) : orders.length === 0 ? (
        <div className="bg-white rounded-xl shadow-card p-8 text-center">
          <p className="text-neutral-600">No hay pedidos registrados</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-card overflow-hidden">
          <table className="w-full">
            <thead className="bg-neutral-100">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-600 uppercase">ID Pedido</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-600 uppercase">Usuario</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-600 uppercase">Productos</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-600 uppercase">Total</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-600 uppercase">Fecha</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200">
              {orders.map((order) => (
                <tr key={order._id} className="hover:bg-neutral-50">
                  <td className="px-6 py-4 font-medium text-neutral-900">#{order._id?.slice(-6)?.toUpperCase() || 'N/A'}</td>
                  <td className="px-6 py-4 text-neutral-600">{order.usuario?.email || order.usuario?.firstName || '-'}</td>
                  <td className="px-6 py-4 text-neutral-600">
                    {order.products?.map((p) => `${p.product?.nombre || 'Producto'} ×${p.amount ?? 0}`).join(', ') || '-'}
                  </td>
                  <td className="px-6 py-4 text-primary-600 font-semibold">
                    €{order.totalAmount != null ? order.totalAmount.toFixed(2) : order.products?.reduce((s, p) => s + (p.product?.precio ?? 0) * (p.amount ?? 0), 0)?.toFixed(2) ?? '-'}
                  </td>
                  <td className="px-6 py-4 text-neutral-600">
                    {order.createdAt ? new Date(order.createdAt).toLocaleDateString('es-ES') : '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AdminLayout>
  )
}
