import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'
import { fetchProducts, createOffer } from '../../services/api.js'

export default function AdminAddOffer() {
  const navigate = useNavigate()
  const { logout } = useAuth()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [form, setForm] = useState({
    title: '',
    product: '',
    offerType: 'precio',
    offerPrice: '',
    buyX: '',
    payY: '',
    offerText: '',
    startDate: '',
    endDate: '',
    useEndDate: false,
  })

  useEffect(() => {
    fetchProducts()
      .then((data) => setProducts(data.filter((p) => (p.amount ?? 0) > 0)))
      .catch(() => setProducts([]))
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    if (name === 'useEndDate') {
      setForm((prev) => ({ ...prev, useEndDate: !!e.target.checked }))
    } else {
      setForm((prev) => ({ ...prev, [name]: value }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      const payload = {
        title: form.title.trim(),
        product: form.product,
        offerType: form.offerType,
        startDate: form.startDate,
        endDate: form.useEndDate && form.endDate ? form.endDate : null,
      }
      if (form.offerType === 'precio') {
        payload.offerPrice = parseFloat(form.offerPrice) || 0
      } else if (form.offerType === 'si_llevas') {
        payload.buyX = parseInt(form.buyX, 10) || 1
        payload.payY = parseFloat(form.payY) || 0
      } else if (form.offerType === 'especial') {
        payload.offerText = form.offerText.trim()
      }
      await createOffer(payload)
      navigate('/admin/offers')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }


  return (
    <div className="flex min-h-screen">
      <aside className="w-64 bg-green-dark text-white p-6 flex flex-col">
        <Link to="/" className="font-playfair text-xl font-semibold mb-8 block text-white hover:text-green-light">
          Inicio
        </Link>
        <nav className="space-y-2 flex-1">
          <Link to="/admin/products" className="block py-2 text-green-light/90 hover:text-white transition-colors">
            Productos
          </Link>
          <Link to="/admin/add-product" className="block py-2 text-green-light/90 hover:text-white transition-colors">
            Añadir producto
          </Link>
          <Link to="/admin/offers" className="block py-2 text-green-light/90 hover:text-white transition-colors">
            Ofertas
          </Link>
          <Link to="/admin/add-offer" className="block py-2 text-white font-medium">
            Crear oferta
          </Link>
          <Link to="/admin/orders" className="block py-2 text-green-light/90 hover:text-white transition-colors">
            Pedidos
          </Link>
        </nav>
        <button
          onClick={() => { logout(); navigate('/') }}
          className="mt-4 py-2 text-green-light/90 hover:text-white transition-colors text-left"
        >
          Cerrar sesión
        </button>
      </aside>
      <main className="flex-1 p-8 bg-cream">
        <h1 className="font-playfair text-2xl font-bold text-charcoal mb-8">Crear oferta</h1>
        <div className="bg-white rounded-xl shadow-sm p-6 max-w-2xl">
          {error && (
            <p className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm">{error}</p>
          )}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-charcoal mb-2">Título de la oferta *</label>
              <input
                name="title"
                type="text"
                required
                placeholder="Ej: Oferta del día, Oferta del mes..."
                value={form.title}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-mid outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-charcoal mb-2">Producto en oferta *</label>
              <select
                name="product"
                required
                value={form.product}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-mid outline-none"
              >
                <option value="">Selecciona un producto (con stock)</option>
                {products.map((p) => (
                  <option key={p._id} value={p._id}>
                    {p.nombre} - €{p.precio} (stock: {p.amount ?? 0})
                  </option>
                ))}
              </select>
              {products.length === 0 && (
                <p className="mt-1 text-xs text-amber-600">No hay productos con stock. Añade stock primero.</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-charcoal mb-2">Tipo de oferta *</label>
              <select
                name="offerType"
                value={form.offerType}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-mid outline-none"
              >
                <option value="precio">Oferta de precio</option>
                <option value="si_llevas">Si llevas X vale Y</option>
                <option value="especial">Oferta especial</option>
              </select>
            </div>

            {form.offerType === 'precio' && (
              <div>
                <label className="block text-sm font-medium text-charcoal mb-2">Precio en oferta (€) *</label>
                <input
                  name="offerPrice"
                  type="number"
                  required
                  min="0"
                  step="0.01"
                  placeholder="0"
                  value={form.offerPrice}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-mid outline-none"
                />
              </div>
            )}

            {form.offerType === 'si_llevas' && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-charcoal mb-2">Si llevas (cantidad) *</label>
                  <input
                    name="buyX"
                    type="number"
                    required
                    min="1"
                    placeholder="3"
                    value={form.buyX}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-mid outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-charcoal mb-2">Vale (€) *</label>
                  <input
                    name="payY"
                    type="number"
                    required
                    min="0"
                    step="0.01"
                    placeholder="0"
                    value={form.payY}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-mid outline-none"
                  />
                </div>
              </div>
            )}

            {form.offerType === 'especial' && (
              <div>
                <label className="block text-sm font-medium text-charcoal mb-2">Texto de la oferta *</label>
                <textarea
                  name="offerText"
                  required
                  rows={4}
                  placeholder="Describe la oferta especial..."
                  value={form.offerText}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-mid outline-none"
                />
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-charcoal mb-2">Fecha de inicio *</label>
                <input
                  name="startDate"
                  type="date"
                  required
                  value={form.startDate}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-mid outline-none"
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  id="useEndDate"
                  name="useEndDate"
                  type="checkbox"
                  checked={form.useEndDate}
                  onChange={handleChange}
                  className="rounded border-gray-300"
                />
                <label htmlFor="useEndDate" className="text-sm text-charcoal">
                  Usar periodo de fechas (fecha fin)
                </label>
              </div>
              {form.useEndDate && (
                <div>
                  <label className="block text-sm font-medium text-charcoal mb-2">Fecha de fin</label>
                  <input
                    name="endDate"
                    type="date"
                    min={form.startDate}
                    value={form.endDate}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-mid outline-none"
                  />
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-green-mid text-white rounded-lg hover:bg-green-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creando...' : 'Crear oferta'}
            </button>
          </form>
        </div>
      </main>
    </div>
  )
}
