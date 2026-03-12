import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { useCart } from '../context/CartContext.jsx'
import { fetchOrderHistory } from '../services/api.js'

export default function ProfilePage() {
  const navigate = useNavigate()
  const { user, isLoggedIn, logout } = useAuth()
  const { cartItems, cartCount } = useCart()
  const [orders, setOrders] = useState([])
  const [loadingOrders, setLoadingOrders] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login')
      return
    }
    fetchOrderHistory()
      .then(setOrders)
      .catch((err) => setError(err.message))
      .finally(() => setLoadingOrders(false))
  }, [isLoggedIn, navigate])

  if (!isLoggedIn) return null

  const subtotal = cartItems.reduce((sum, item) => sum + item.precio * item.quantity, 0)

  return (
    <div className="pt-24 pb-16 px-4 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <h1 className="font-playfair text-3xl font-bold text-charcoal mb-8">Mi perfil</h1>

        {/* Datos personales */}
        <section className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <h2 className="font-playfair text-xl font-semibold text-charcoal mb-4">Datos personales</h2>
          <dl className="space-y-2">
            <div>
              <dt className="text-sm text-charcoal/70">Nombre</dt>
              <dd className="font-medium text-charcoal">{user?.firstName || '-'}</dd>
            </div>
            <div>
              <dt className="text-sm text-charcoal/70">Apellido</dt>
              <dd className="font-medium text-charcoal">{user?.lastName || '-'}</dd>
            </div>
            <div>
              <dt className="text-sm text-charcoal/70">Correo electrónico</dt>
              <dd className="font-medium text-charcoal">{user?.email || '-'}</dd>
            </div>
          </dl>
          <button
            onClick={() => { logout(); navigate('/'); }}
            className="mt-4 text-red-600 hover:text-red-700 text-sm font-medium"
          >
            Cerrar sesión
          </button>
        </section>

        {/* Carrito */}
        <section className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-playfair text-xl font-semibold text-charcoal">Productos en el carrito</h2>
            {cartCount > 0 && (
              <Link to="/cart" className="text-green-mid hover:text-green-dark text-sm font-medium">
                Ir al carrito →
              </Link>
            )}
          </div>
          {cartItems.length === 0 ? (
            <p className="text-charcoal/70">Tu carrito está vacío</p>
          ) : (
            <div className="space-y-3">
              {cartItems.slice(0, 5).map((item) => (
                <div key={item._id} className="flex gap-3 items-center p-3 bg-gray-50 rounded-lg">
                  {item.imagen && (
                    <img src={item.imagen} alt={item.nombre} className="w-12 h-12 object-cover rounded" />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-charcoal truncate">{item.nombre}</p>
                    <p className="text-sm text-charcoal/70">€{item.precio} × {item.quantity}</p>
                  </div>
                  <p className="font-semibold text-green-mid">€{(item.precio * item.quantity).toFixed(2)}</p>
                </div>
              ))}
              {cartItems.length > 5 && (
                <p className="text-sm text-charcoal/70">+{cartItems.length - 5} productos más</p>
              )}
              <Link
                to="/cart"
                className="inline-block mt-2 px-4 py-2 bg-green-mid text-white rounded-lg hover:bg-green-dark transition-colors text-sm font-medium"
              >
                Ver carrito completo (€{subtotal.toFixed(2)})
              </Link>
            </div>
          )}
        </section>

        {/* Pedidos anteriores */}
        <section className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="font-playfair text-xl font-semibold text-charcoal mb-4">Pedidos anteriores</h2>
          {loadingOrders ? (
            <p className="text-charcoal/70">Cargando pedidos...</p>
          ) : error ? (
            <p className="text-red-600">{error}</p>
          ) : orders.length === 0 ? (
            <p className="text-charcoal/70">Aún no has realizado ningún pedido</p>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div key={order._id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-sm text-charcoal/70">
                      Pedido #{order._id?.slice(-6)?.toUpperCase() || 'N/A'}
                    </span>
                    <span className={`text-xs px-2 py-0.5 rounded ${
                      order.state === 'Pendiente' ? 'bg-amber-100 text-amber-800' : 'bg-green-100 text-green-800'
                    }`}>
                      {order.state || 'Pendiente'}
                    </span>
                  </div>
                  <ul className="text-sm text-charcoal space-y-1">
                    {order.products?.map((p, i) => (
                      <li key={i}>
                        {p.product?.nombre || 'Producto'} × {p.amount}
                      </li>
                    ))}
                  </ul>
                  <p className="text-xs text-charcoal/60 mt-2">
                    {new Date(order.createdAt).toLocaleDateString('es-ES')}
                  </p>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
