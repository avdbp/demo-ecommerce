import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { createOrder } from '../services/api.js'

export default function CartPage() {
  const navigate = useNavigate()
  const { cartItems, removeFromCart, updateQuantity, clearCart } = useCart()
  const { isLoggedIn } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [showPayment, setShowPayment] = useState(false)
  const [card, setCard] = useState({
    number: '',
    expiry: '',
    cvv: '',
    name: '',
  })

  const subtotal = cartItems.reduce((sum, item) => sum + item.precio * item.quantity, 0)
  const total = subtotal

  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '').slice(0, 16)
    return v.replace(/(\d{4})(?=\d)/g, '$1 ').trim()
  }

  const formatExpiry = (value) => {
    const v = value.replace(/\D/g, '')
    if (v.length >= 2) return v.slice(0, 2) + '/' + v.slice(2, 4)
    return v
  }

  const validateCard = () => {
    const num = card.number.replace(/\s/g, '')
    if (num.length !== 16) return 'Número de tarjeta inválido (16 dígitos)'
    if (card.expiry.length !== 5) return 'Fecha de caducidad inválida (MM/AA)'
    const [mm, aa] = card.expiry.split('/')
    if (parseInt(mm, 10) < 1 || parseInt(mm, 10) > 12) return 'Mes inválido'
    if (card.cvv.length < 3) return 'CVV inválido (3-4 dígitos)'
    if (!card.name.trim()) return 'Nombre del titular obligatorio'
    return null
  }

  const handleCheckout = async () => {
    if (!isLoggedIn || cartItems.length === 0) return
    setError('')
    setLoading(true)
    try {
      await createOrder(cartItems, total)
      clearCart()
      setSuccess(true)
      setShowPayment(false)
    } catch (err) {
      setError(err.message || 'Error al crear el pedido')
    } finally {
      setLoading(false)
    }
  }

  const handlePaymentSubmit = (e) => {
    e.preventDefault()
    const err = validateCard()
    if (err) {
      setError(err)
      return
    }
    setError('')
    handleCheckout()
  }

  if (cartItems.length === 0 && !success) {
    return (
      <div className="pt-24 pb-16 px-4 min-h-screen">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="font-bold text-3xl font-semibold text-neutral-900 mb-4">Tu carrito está vacío</h1>
          <p className="text-neutral-500 mb-8">Añade productos para continuar</p>
          <Link
            to="/"
            className="inline-block px-8 py-4 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors font-medium"
          >
            Volver a tienda
          </Link>
        </div>
      </div>
    )
  }

  if (success) {
    return (
      <div className="pt-24 pb-16 px-4 min-h-screen">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="font-bold text-3xl font-semibold text-primary-600 mb-4">¡Pedido realizado!</h1>
          <p className="text-neutral-500 mb-8">Tu pedido se ha guardado correctamente.</p>
          <Link
            to="/"
            className="inline-block px-8 py-4 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors font-medium"
          >
            Volver al inicio
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="pt-24 pb-16 px-4 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <h1 className="font-bold text-3xl font-semibold text-neutral-900 mb-8 tracking-tight">Carrito</h1>
        <div className="space-y-6 mb-8">
          {cartItems.map((item) => (
            <div
              key={item._id}
              className="flex gap-4 p-5 bg-white rounded-xl border border-neutral-200 shadow-card"
            >
              <img
                src={item.imagen}
                alt={item.nombre}
                className="w-24 h-24 object-cover rounded-xl"
              />
              <div className="flex-1">
                <h3 className="font-bold font-semibold text-neutral-900">{item.nombre}</h3>
                <p className="text-primary-600 font-semibold">€{item.precio}</p>
                <div className="flex items-center gap-2 mt-2">
                  <button
                    onClick={() => updateQuantity(item._id, item.quantity - 1)}
                    className="w-9 h-9 rounded-lg bg-neutral-100 hover:bg-neutral-200 flex items-center justify-center transition-colors"
                  >
                    -
                  </button>
                  <span className="w-8 text-center text-neutral-600">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item._id, item.quantity + 1)}
                    className="w-9 h-9 rounded-lg bg-neutral-100 hover:bg-neutral-200 flex items-center justify-center transition-colors"
                  >
                    +
                  </button>
                  <button
                    onClick={() => removeFromCart(item._id)}
                    className="ml-4 text-red-600 hover:text-red-700 text-sm font-medium"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold">€{(item.precio * item.quantity).toFixed(2)}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="bg-white rounded-xl border border-neutral-200 p-6 shadow-card">
          <div className="flex justify-between mb-2">
            <span>Subtotal</span>
            <span>€{subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between font-semibold text-lg mt-4 pt-4 border-t">
            <span>Total</span>
            <span>€{total.toFixed(2)}</span>
          </div>
          {error && <p className="mt-2 text-red-600 text-sm">{error}</p>}
          {!showPayment ? (
            <button
              onClick={() => {
                if (!isLoggedIn) {
                  navigate('/login', { state: { from: '/cart' } })
                  return
                }
                setError('')
                setShowPayment(true)
              }}
              className="w-full mt-6 py-4 rounded-lg font-semibold bg-primary-500 hover:bg-primary-600 text-white transition-colors"
            >
              Realizar pedido
            </button>
          ) : (
            <form onSubmit={handlePaymentSubmit} className="mt-6 space-y-4">
              <p className="text-sm text-neutral-500">
                Simulación de pago con tarjeta ficticia. Usa cualquier número de 16 dígitos (ej: 4242 4242 4242 4242).
              </p>
              <div>
                <label className="block text-sm font-medium text-neutral-900 mb-1">Número de tarjeta</label>
                <input
                  type="text"
                  placeholder="4242 4242 4242 4242"
                  maxLength={19}
                  value={card.number}
                  onChange={(e) => setCard((c) => ({ ...c, number: formatCardNumber(e.target.value) }))}
                  className="w-full px-4 py-3 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-900 mb-1">Caducidad (MM/AA)</label>
                  <input
                    type="text"
                    placeholder="12/26"
                    maxLength={5}
                    value={card.expiry}
                    onChange={(e) => setCard((c) => ({ ...c, expiry: formatExpiry(e.target.value) }))}
                    className="w-full px-4 py-3 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-900 mb-1">CVV</label>
                  <input
                    type="text"
                    placeholder="123"
                    maxLength={4}
                    value={card.cvv}
                    onChange={(e) => setCard((c) => ({ ...c, cvv: e.target.value.replace(/\D/g, '') }))}
                    className="w-full px-4 py-3 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-900 mb-1">Titular de la tarjeta</label>
                <input
                  type="text"
                  placeholder="Nombre como aparece en la tarjeta"
                  value={card.name}
                  onChange={(e) => setCard((c) => ({ ...c, name: e.target.value }))}
                  className="w-full px-4 py-3 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
                />
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => { setShowPayment(false); setError(''); }}
                  className="flex-1 py-3 rounded-lg font-semibold border border-neutral-200 text-neutral-900 hover:bg-neutral-50 transition-colors"
                >
                  Volver
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className={`flex-1 py-3 rounded-lg font-semibold transition-colors ${
                    loading ? 'bg-neutral-200 text-neutral-500 cursor-not-allowed' : 'bg-primary-500 hover:bg-primary-600 text-white'
                  }`}
                >
                  {loading ? 'Procesando...' : 'Simular pago'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
