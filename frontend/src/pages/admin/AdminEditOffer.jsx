import { useState, useEffect } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'
import { fetchOffer, fetchProducts, updateOffer } from '../../services/api.js'

export default function AdminEditOffer() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { logout } = useAuth()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
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
    active: true,
  })

  useEffect(() => {
    Promise.all([fetchOffer(id), fetchProducts()])
      .then(([offer, prods]) => {
        setForm({
          title: offer.title || '',
          product: offer.product?._id || offer.product || '',
          offerType: offer.offerType || 'precio',
          offerPrice: offer.offerPrice ?? '',
          buyX: offer.buyX ?? '',
          payY: offer.payY ?? '',
          offerText: offer.offerText || '',
          startDate: offer.startDate ? new Date(offer.startDate).toISOString().slice(0, 10) : '',
          endDate: offer.endDate ? new Date(offer.endDate).toISOString().slice(0, 10) : '',
          useEndDate: !!offer.endDate,
          active: offer.active !== false,
        })
        setProducts(prods)
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [id])

  const handleChange = (e) => {
    const { name, value } = e.target
    if (name === 'useEndDate') {
      setForm((prev) => ({ ...prev, useEndDate: !!e.target.checked }))
    } else if (name === 'active') {
      setForm((prev) => ({ ...prev, active: !!e.target.checked }))
    } else {
      setForm((prev) => ({ ...prev, [name]: value }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setSaving(true)
    try {
      const payload = {
        title: form.title.trim(),
        product: form.product,
        offerType: form.offerType,
        startDate: form.startDate,
        endDate: form.useEndDate && form.endDate ? form.endDate : null,
        active: form.active,
      }
      if (form.offerType === 'precio') payload.offerPrice = parseFloat(form.offerPrice) || 0
      else if (form.offerType === 'si_llevas') {
        payload.buyX = parseInt(form.buyX, 10) || 1
        payload.payY = parseFloat(form.payY) || 0
      } else if (form.offerType === 'especial') payload.offerText = form.offerText.trim()
      await updateOffer(id, payload)
      navigate('/admin/offers')
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <p className="p-8 text-charcoal">Cargando...</p>
  if (error && !form.title) {
    return (
      <div className="p-8">
        <p className="text-red-600 mb-4">{error}</p>
        <Link to="/admin/offers" className="text-green-mid hover:underline">Volver a Ofertas</Link>
      </div>
    )
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
          <Link to="/admin/offers" className="block py-2 text-white font-medium">
            Ofertas
          </Link>
          <Link to="/admin/add-offer" className="block py-2 text-green-light/90 hover:text-white transition-colors">
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
        <h1 className="font-playfair text-2xl font-bold text-charcoal mb-8">Editar oferta</h1>
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
                value={form.title}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-mid outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-charcoal mb-2">Producto *</label>
              <select
                name="product"
                required
                value={form.product}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-mid outline-none"
              >
                <option value="">Selecciona un producto</option>
                {products.map((p) => (
                  <option key={p._id} value={p._id}>
                    {p.nombre} - €{p.precio}
                  </option>
                ))}
              </select>
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
                <label htmlFor="useEndDate" className="text-sm text-charcoal">Usar periodo de fechas</label>
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
              <div className="flex items-center gap-2">
                <input
                  id="active"
                  name="active"
                  type="checkbox"
                  checked={form.active}
                  onChange={handleChange}
                  className="rounded border-gray-300"
                />
                <label htmlFor="active" className="text-sm text-charcoal">Oferta activa</label>
              </div>
            </div>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2 bg-green-mid text-white rounded-lg hover:bg-green-dark transition-colors disabled:opacity-50"
            >
              {saving ? 'Guardando...' : 'Guardar'}
            </button>
          </form>
        </div>
      </main>
    </div>
  )
}
