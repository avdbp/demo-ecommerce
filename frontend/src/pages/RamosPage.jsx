import { useState, useEffect } from 'react'
import ProductCard from '../components/ProductCard.jsx'
import { fetchProducts, fetchActiveOffers } from '../services/api.js'

export default function RamosPage() {
  const [ramos, setRamos] = useState([])
  const [offers, setOffers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchProducts()
      .then((data) => setRamos(data.filter((p) => p.categoria === 'ramos')))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    fetchActiveOffers().then(setOffers).catch(() => setOffers([]))
  }, [])

  if (loading) {
    return (
      <div className="pt-24 pb-16 px-4 min-h-screen flex items-center justify-center">
        <p className="text-neutral-500">Cargando productos...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="pt-24 pb-16 px-4 min-h-screen text-center">
        <p className="text-red-600 mb-4">{error}</p>
        <p className="text-neutral-500 text-sm">
          {import.meta.env.DEV
            ? 'Asegúrate de que el backend esté corriendo (cd backend && npm run dev)'
            : 'Verifica que las variables de entorno estén configuradas en Vercel y haz un redeploy'}
        </p>
      </div>
    )
  }

  return (
    <div className="pt-24 pb-20 px-4 min-h-screen bg-neutral-50">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold text-neutral-900 mb-10">
          Nuestros Ramos y Flores
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {ramos.map((product) => (
            <ProductCard key={product._id} product={product} offers={offers} />
          ))}
        </div>
        {ramos.length === 0 && (
          <p className="text-neutral-500 text-center py-12">No hay ramos disponibles</p>
        )}
      </div>
    </div>
  )
}
