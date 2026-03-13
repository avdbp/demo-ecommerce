import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import AdminLayout from '../../components/AdminLayout.jsx'
import { fetchOffers, deleteOffer } from '../../services/api.js'

export default function AdminOffers() {
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
    <AdminLayout title="Ofertas">
      <div className="flex justify-between items-center mb-6">
        <span />
        <Link to="/admin/add-offer" className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors text-sm font-medium">
          Crear oferta
        </Link>
      </div>
      {loading ? (
        <p className="text-neutral-600">Cargando ofertas...</p>
      ) : offers.length === 0 ? (
        <div className="bg-white rounded-xl shadow-card p-8 text-center">
          <p className="text-neutral-600 mb-4">No hay ofertas creadas</p>
          <Link to="/admin/add-offer" className="inline-block px-6 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors font-medium">
            Crear primera oferta
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-card overflow-hidden">
          <table className="min-w-full">
            <thead className="bg-neutral-100">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-600 uppercase">Título</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-600 uppercase">Producto</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-600 uppercase">Tipo</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-600 uppercase">Detalle</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-600 uppercase">Fechas</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-neutral-600 uppercase">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200">
              {offers.map((offer) => (
                <tr key={offer._id} className="hover:bg-neutral-50">
                  <td className="px-6 py-4 font-medium text-neutral-900">{offer.title}</td>
                  <td className="px-6 py-4 text-neutral-600">{offer.product?.nombre || '-'}</td>
                  <td className="px-6 py-4">
                    <span className="text-xs px-2 py-0.5 rounded bg-primary-100 text-primary-700">
                      {offer.offerType === 'precio' && 'Precio'}
                      {offer.offerType === 'si_llevas' && 'Si llevas X vale Y'}
                      {offer.offerType === 'especial' && 'Especial'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-neutral-600">{getOfferSummary(offer)}</td>
                  <td className="px-6 py-4 text-sm text-neutral-600">
                    {formatDate(offer.startDate)}
                    {offer.endDate && ` - ${formatDate(offer.endDate)}`}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link to={`/admin/edit-offer/${offer._id}`} className="text-primary-600 hover:text-primary-700 mr-4 font-medium">Editar</Link>
                    <button onClick={() => handleDelete(offer._id)} className="text-red-600 hover:text-red-700 font-medium">Eliminar</button>
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
