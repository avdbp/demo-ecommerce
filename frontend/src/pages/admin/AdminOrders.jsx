import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'

const SAMPLE_ORDERS = [
  {
    _id: 'ORD001',
    user: 'María García',
    products: 'Monstera Deliciosa x2, Ramo de Rosas',
    status: 'pendiente',
    date: '2024-01-15',
  },
  {
    _id: 'ORD002',
    user: 'Carlos López',
    products: 'Pothos Dorado, Ramo de Tulipanes',
    status: 'entregado',
    date: '2024-01-14',
  },
]

export default function AdminOrders() {
  const navigate = useNavigate()
  const { logout } = useAuth()

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
            className="block py-2 text-white font-medium"
          >
            Pedidos
          </Link>
        </nav>
        <button
          onClick={() => { logout(); navigate('/'); }}
          className="mt-4 py-2 text-green-light/90 hover:text-white transition-colors text-left"
        >
          Cerrar sesión
        </button>
      </aside>
      <main className="flex-1 p-8 bg-cream overflow-x-auto">
        <h1 className="font-playfair text-2xl font-bold text-charcoal mb-8">Pedidos</h1>
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-charcoal uppercase">ID Pedido</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-charcoal uppercase">Usuario</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-charcoal uppercase">Productos</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-charcoal uppercase">Estado</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-charcoal uppercase">Fecha</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {SAMPLE_ORDERS.map((order) => (
                <tr key={order._id}>
                  <td className="px-6 py-4 font-medium text-charcoal">{order._id}</td>
                  <td className="px-6 py-4 text-charcoal/80">{order.user}</td>
                  <td className="px-6 py-4 text-charcoal/80">{order.products}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${
                        order.status === 'pendiente'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-green-light/20 text-green-dark'
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-charcoal/80">{order.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  )
}
