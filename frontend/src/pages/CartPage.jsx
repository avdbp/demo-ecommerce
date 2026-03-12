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
          <h1 className="font-playfair text-3xl font-bold text-charcoal mb-4">Tu carrito está vacío</h1>
          <p className="text-charcoal/80 mb-8">Añade productos para continuar</p>
          <Link
            to="/plantas"
            className="inline-block px-6 py-3 bg-green-mid text-white rounded-lg hover:bg-green-dark transition-colors"
          >
            Ver Plantas
          </Link>
        </div>
      </div>
    )
  }

  if (success) {
    return (
      <div className="pt-24 pb-16 px-4 min-h-screen">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="font-playfair text-3xl font-bold text-green-mid mb-4">¡Pedido realizado!</h1>
          <p className="text-charcoal/80 mb-8">Tu pedido se ha guardado correctamente.</p>
          <Link
            to="/"
            className="inline-block px-6 py-3 bg-green-mid text-white rounded-lg hover:bg-green-dark transition-colors"
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
        <h1 className="font-playfair text-3xl font-bold text-charcoal mb-8">Carrito</h1>
        <div className="space-y-6 mb-8">
          {cartItems.map((item) => (
            <div
              key={item._id}
              className="flex gap-4 p-4 bg-white rounded-xl shadow-sm"
            >
              <img
                src={item.imagen}
                alt={item.nombre}
                className="w-24 h-24 object-cover rounded-lg"
              />
              <div className="flex-1">
                <h3 className="font-playfair font-semibold text-charcoal">{item.nombre}</h3>
                <p className="text-green-mid font-semibold">€{item.precio}</p>
                <div className="flex items-center gap-2 mt-2">
                  <button
                    onClick={() => updateQuantity(item._id, item.quantity - 1)}
                    className="w-8 h-8 rounded bg-gray-100 hover:bg-gray-200 flex items-center justify-center"
                  >
                    -
                  </button>
                  <span className="w-8 text-center">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item._id, item.quantity + 1)}
                    className="w-8 h-8 rounded bg-gray-100 hover:bg-gray-200 flex items-center justify-center"
                  >
                    +
                  </button>
                  <button
                    onClick={() => removeFromCart(item._id)}
                    className="ml-4 text-red-600 hover:text-red-700 text-sm"
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
        <div className="bg-white rounded-xl shadow-sm p-6">
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
              className="w-full mt-6 py-3 rounded-lg font-semibold bg-green-mid hover:bg-green-dark text-white transition-colors"
            >
              Realizar pedido
            </button>
          ) : (
            <form onSubmit={handlePaymentSubmit} className="mt-6 space-y-4">
              <p className="text-sm text-charcoal/70">
                Simulación de pago con tarjeta ficticia. Usa cualquier número de 16 dígitos (ej: 4242 4242 4242 4242).
              </p>
              <div>
                <label className="block text-sm font-medium text-charcoal mb-1">Número de tarjeta</label>
                <input
                  type="text"
                  placeholder="4242 4242 4242 4242"
                  maxLength={19}
                  value={card.number}
                  onChange={(e) => setCard((c) => ({ ...c, number: formatCardNumber(e.target.value) }))}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-mid outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-charcoal mb-1">Caducidad (MM/AA)</label>
                  <input
                    type="text"
                    placeholder="12/26"
                    maxLength={5}
                    value={card.expiry}
                    onChange={(e) => setCard((c) => ({ ...c, expiry: formatExpiry(e.target.value) }))}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-mid outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-charcoal mb-1">CVV</label>
                  <input
                    type="text"
                    placeholder="123"
                    maxLength={4}
                    value={card.cvv}
                    onChange={(e) => setCard((c) => ({ ...c, cvv: e.target.value.replace(/\D/g, '') }))}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-mid outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-charcoal mb-1">Titular de la tarjeta</label>
                <input
                  type="text"
                  placeholder="Nombre como aparece en la tarjeta"
                  value={card.name}
                  onChange={(e) => setCard((c) => ({ ...c, name: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-mid outline-none"
                />
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => { setShowPayment(false); setError(''); }}
                  className="flex-1 py-3 rounded-lg font-semibold border border-gray-300 text-charcoal hover:bg-gray-50 transition-colors"
                >
                  Volver
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className={`flex-1 py-3 rounded-lg font-semibold transition-colors ${
                    loading ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-green-mid hover:bg-green-dark text-white'
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
