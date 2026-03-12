import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'
import { fetchOffers, deleteOffer } from '../../services/api.js'

export default function AdminOffers() {
  const navigate = useNavigate()
  const { logout } = useAuth()
  const [offers, setOffers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchOffers()
      .then(setOffers)
      .catch(() => setOffers([]))
      .finally(() => setLoading(false))
  }, [])

  const handleDelete = async (id) => {
    if (!confirm('¿Eliminar esta oferta?')) return
    try {
      await deleteOffer(id)
      setOffers((prev) => prev.filter((o) => o._id !== id))
    } catch (err) {
      alert(err.message)
    }
  }

  const formatDate = (d) => {
    if (!d) return '-'
    return new Date(d).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    })
  }

  const getOfferSummary = (offer) => {
    if (offer.offerType === 'precio')
      return `€${offer.offerPrice} (antes €${offer.product?.precio})`
    if (offer.offerType === 'si_llevas')
      return `Si llevas ${offer.buyX} vale €${offer.payY}`
    if (offer.offerType === 'especial')
      return offer.offerText?.slice(0, 40) + (offer.offerText?.length > 40 ? '...' : '')
    return '-'
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
        <div className="flex justify-between items-center mb-8">
          <h1 className="font-playfair text-2xl font-bold text-charcoal">Ofertas</h1>
          <Link
            to="/admin/add-offer"
            className="px-4 py-2 bg-green-mid text-white rounded-lg hover:bg-green-dark transition-colors text-sm font-medium"
          >
            Crear oferta
          </Link>
        </div>
        {loading ? (
          <p className="text-charcoal/70">Cargando ofertas...</p>
        ) : offers.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-8 text-center">
            <p className="text-charcoal/70 mb-4">No hay ofertas creadas</p>
            <Link
              to="/admin/add-offer"
              className="inline-block px-6 py-2 bg-green-mid text-white rounded-lg hover:bg-green-dark transition-colors"
            >
              Crear primera oferta
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-charcoal/70 uppercase">Título</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-charcoal/70 uppercase">Producto</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-charcoal/70 uppercase">Tipo</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-charcoal/70 uppercase">Detalle</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-charcoal/70 uppercase">Fechas</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-charcoal/70 uppercase">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {offers.map((offer) => (
                  <tr key={offer._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-charcoal">{offer.title}</td>
                    <td className="px-6 py-4 text-charcoal/80">{offer.product?.nombre || '-'}</td>
                    <td className="px-6 py-4">
                      <span className="text-xs px-2 py-0.5 rounded bg-green-light/20 text-green-dark">
                        {offer.offerType === 'precio' && 'Precio'}
                        {offer.offerType === 'si_llevas' && 'Si llevas X vale Y'}
                        {offer.offerType === 'especial' && 'Especial'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-charcoal/80">{getOfferSummary(offer)}</td>
                    <td className="px-6 py-4 text-sm text-charcoal/70">
                      {formatDate(offer.startDate)}
                      {offer.endDate && ` - ${formatDate(offer.endDate)}`}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link
                        to={`/admin/edit-offer/${offer._id}`}
                        className="text-green-mid hover:text-green-dark mr-4"
                      >
                        Editar
                      </Link>
                      <button
                        onClick={() => handleDelete(offer._id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  )
}
