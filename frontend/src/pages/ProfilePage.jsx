import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { useCart } from '../context/CartContext.jsx'
import { fetchOrderHistory, updateProfile } from '../services/api.js'

export default function ProfilePage() {
  const navigate = useNavigate()
  const { user, isLoggedIn, logout, updateUser } = useAuth()
  const { cartItems, cartCount } = useCart()
  const [orders, setOrders] = useState([])
  const [loadingOrders, setLoadingOrders] = useState(true)
  const [error, setError] = useState(null)
  const [editing, setEditing] = useState(false)
  const [editForm, setEditForm] = useState({ username: '', firstName: '', lastName: '' })
  const [editError, setEditError] = useState('')
  const [editLoading, setEditLoading] = useState(false)

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

  useEffect(() => {
    if (user) {
      setEditForm({
        username: user.username || '',
        firstName: user.firstName || '',
        lastName: user.lastName || '',
      })
    }
  }, [user])

  const handleEditSubmit = async (e) => {
    e.preventDefault()
    setEditError('')
    setEditLoading(true)
    try {
      const res = await updateProfile(editForm)
      if (res.authToken) {
        localStorage.setItem('authToken', res.authToken)
      }
      updateUser(res.user || editForm)
      setEditing(false)
    } catch (err) {
      setEditError(err.message || 'Error al guardar')
    } finally {
      setEditLoading(false)
    }
  }

  if (!isLoggedIn) return null

  const subtotal = cartItems.reduce((sum, item) => sum + item.precio * item.quantity, 0)

  return (
    <div className="pt-24 pb-20 px-4 min-h-screen bg-neutral-50">
      <div className="max-w-4xl mx-auto">
        <h1 className="font-bold text-3xl font-semibold text-neutral-900 mb-8 tracking-tight">Mi perfil</h1>

        {/* Datos personales */}
        <section className="bg-white rounded-xl border border-neutral-200 shadow-card p-6 mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-bold text-xl font-semibold text-neutral-900">Datos personales</h2>
            {!editing ? (
              <button
                onClick={() => setEditing(true)}
                className="text-primary-600 hover:text-primary-700 text-sm font-medium"
              >
                Editar
              </button>
            ) : (
              <button
                onClick={() => {
                  setEditing(false)
                  setEditForm({ username: user?.username || '', firstName: user?.firstName || '', lastName: user?.lastName || '' })
                  setEditError('')
                }}
                className="text-neutral-500 hover:text-neutral-700 text-sm font-medium"
              >
                Cancelar
              </button>
            )}
          </div>
          {editing ? (
            <form onSubmit={handleEditSubmit} className="space-y-4">
              {editError && <p className="text-red-600 text-sm">{editError}</p>}
              <div>
                <label className="block text-sm font-medium text-neutral-900 mb-1">Nombre de usuario</label>
                <input
                  type="text"
                  value={editForm.username}
                  onChange={(e) => setEditForm((f) => ({ ...f, username: e.target.value }))}
                  placeholder="Añade o cambia tu nombre de usuario"
                  minLength={3}
                  className="w-full px-4 py-3 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
                />
                <p className="text-xs text-neutral-500 mt-1">Mín. 3 caracteres. Debe ser único.</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-900 mb-1">Nombre</label>
                <input
                  type="text"
                  value={editForm.firstName}
                  onChange={(e) => setEditForm((f) => ({ ...f, firstName: e.target.value }))}
                  required
                  className="w-full px-4 py-3 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-900 mb-1">Apellido</label>
                <input
                  type="text"
                  value={editForm.lastName}
                  onChange={(e) => setEditForm((f) => ({ ...f, lastName: e.target.value }))}
                  required
                  className="w-full px-4 py-3 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
                />
              </div>
              <button
                type="submit"
                disabled={editLoading}
                className="px-6 py-2.5 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors font-medium disabled:opacity-50"
              >
                {editLoading ? 'Guardando...' : 'Guardar cambios'}
              </button>
            </form>
          ) : (
            <dl className="space-y-2">
              <div>
                <dt className="text-sm text-neutral-500">Nombre de usuario</dt>
                <dd className="font-medium text-neutral-900">{user?.username || <span className="text-neutral-400 italic">Vacío — puedes añadirlo editando</span>}</dd>
              </div>
              <div>
                <dt className="text-sm text-neutral-500">Nombre</dt>
                <dd className="font-medium text-neutral-900">{user?.firstName || '-'}</dd>
              </div>
              <div>
                <dt className="text-sm text-neutral-500">Apellido</dt>
                <dd className="font-medium text-neutral-900">{user?.lastName || '-'}</dd>
              </div>
              <div>
                <dt className="text-sm text-neutral-500">Correo electrónico</dt>
                <dd className="font-medium text-neutral-900">{user?.email || '-'}</dd>
              </div>
            </dl>
          )}
          <button
            onClick={() => { logout(); navigate('/'); }}
            className="mt-4 text-red-600 hover:text-red-700 text-sm font-medium"
          >
            Cerrar sesión
          </button>
        </section>

        {/* Carrito */}
        <section className="bg-white rounded-xl border border-neutral-200 p-6 mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-bold text-xl font-semibold text-neutral-900">Productos en el carrito</h2>
            {cartCount > 0 && (
              <Link to="/cart" className="text-primary-600 hover:text-sage-700 text-sm font-medium">
                Ir al carrito →
              </Link>
            )}
          </div>
          {cartItems.length === 0 ? (
            <p className="text-neutral-500">Tu carrito está vacío</p>
          ) : (
            <div className="space-y-3">
              {cartItems.slice(0, 5).map((item) => (
                <div key={item._id} className="flex gap-3 items-center p-3 bg-neutral-100 rounded-xl">
                  {item.imagen && (
                    <img src={item.imagen} alt={item.nombre} className="w-12 h-12 object-cover rounded-lg" />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-neutral-900 truncate">{item.nombre}</p>
                    <p className="text-sm text-neutral-500">€{item.precio} × {item.quantity}</p>
                  </div>
                  <p className="font-semibold text-primary-600">€{(item.precio * item.quantity).toFixed(2)}</p>
                </div>
              ))}
              {cartItems.length > 5 && (
                <p className="text-sm text-neutral-500">+{cartItems.length - 5} productos más</p>
              )}
              <Link
                to="/cart"
                className="inline-block mt-2 px-5 py-2.5 bg-primary-500 text-white rounded-full hover:bg-primary-600 transition-colors text-sm font-medium"
              >
                Ver carrito completo (€{subtotal.toFixed(2)})
              </Link>
            </div>
          )}
        </section>

        {/* Pedidos anteriores */}
        <section className="bg-white rounded-xl border border-neutral-200 p-6">
          <h2 className="font-bold text-xl font-semibold text-neutral-900 mb-4">Pedidos anteriores</h2>
          {loadingOrders ? (
            <p className="text-neutral-500">Cargando pedidos...</p>
          ) : error ? (
            <p className="text-red-600">{error}</p>
          ) : orders.length === 0 ? (
            <p className="text-neutral-500">Aún no has realizado ningún pedido</p>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div key={order._id} className="border border-neutral-200 rounded-xl p-4">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-sm text-neutral-500">
                      Pedido #{order._id?.slice(-6)?.toUpperCase() || 'N/A'}
                    </span>
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                      order.state === 'Pendiente' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-700'
                    }`}>
                      {order.state || 'Pendiente'}
                    </span>
                  </div>
                  <ul className="text-sm text-neutral-900 space-y-1">
                    {order.products?.map((p, i) => (
                      <li key={i}>
                        {p.product?.nombre || 'Producto'} × {p.amount}
                      </li>
                    ))}
                  </ul>
                  <p className="text-xs text-stone-400 mt-2">
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
