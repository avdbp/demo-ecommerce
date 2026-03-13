import { useState, useEffect } from 'react'
import ProductCard from '../components/ProductCard.jsx'
import { fetchProducts, fetchActiveOffers } from '../services/api.js'

export default function PlantasPage() {
  const [filter, setFilter] = useState('all')
  const [plantas, setPlantas] = useState([])
  const [offers, setOffers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchProducts()
      .then((data) => setPlantas(data.filter((p) => p.categoria === 'plantas' || p.categoria === 'planta')))
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

  const filterBtnClass = (isActive) =>
    `px-5 py-2.5 rounded-lg text-sm font-medium transition-colors ${
      isActive ? 'bg-primary-500 text-white' : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
    }`

  return (
    <div className="pt-24 pb-20 px-4 min-h-screen bg-neutral-50">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold text-neutral-900 mb-10">
          Nuestras Plantas
        </h1>
        <div className="flex flex-wrap gap-2 mb-10">
          <button onClick={() => setFilter('all')} className={filterBtnClass(filter === 'all')}>
            Todos
          </button>
          <button onClick={() => setFilter('interior')} className={filterBtnClass(filter === 'interior')}>
            Interior
          </button>
          <button onClick={() => setFilter('exterior')} className={filterBtnClass(filter === 'exterior')}>
            Exterior
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {plantas
            .filter((p) => {
              if (filter === 'all') return true
              const ubicacion = Array.isArray(p.ubicacion) ? p.ubicacion : []
              if (ubicacion.length === 0) return true
              return ubicacion.includes(filter)
            })
            .map((product) => (
              <ProductCard key={product._id} product={product} offers={offers} />
            ))}
        </div>
        {plantas.filter((p) => {
          if (filter === 'all') return true
          const ubicacion = Array.isArray(p.ubicacion) ? p.ubicacion : []
          if (ubicacion.length === 0) return true
          return ubicacion.includes(filter)
        }).length === 0 && (
          <p className="text-neutral-500 text-center py-12">
            {filter === 'all' ? 'No hay plantas disponibles' : `No hay plantas de ${filter === 'interior' ? 'interior' : 'exterior'}`}
          </p>
        )}
      </div>
    </div>
  )
}
