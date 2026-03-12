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
        <p className="text-charcoal">Cargando productos...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="pt-24 pb-16 px-4 min-h-screen text-center">
        <p className="text-red-600 mb-4">{error}</p>
        <p className="text-charcoal/80 text-sm">Asegúrate de que el backend esté corriendo en el puerto 5005</p>
      </div>
    )
  }

  return (
    <div className="pt-24 pb-16 px-4 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h1 className="font-playfair text-3xl md:text-4xl font-bold text-charcoal mb-8">
          Nuestras Plantas
        </h1>
        <div className="flex gap-2 mb-10">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'all' ? 'bg-green-mid text-white' : 'bg-gray-100 text-charcoal hover:bg-gray-200'
            }`}
          >
            Todos
          </button>
          <button
            onClick={() => setFilter('interior')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'interior' ? 'bg-green-mid text-white' : 'bg-gray-100 text-charcoal hover:bg-gray-200'
            }`}
          >
            Interior
          </button>
          <button
            onClick={() => setFilter('exterior')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'exterior' ? 'bg-green-mid text-white' : 'bg-gray-100 text-charcoal hover:bg-gray-200'
            }`}
          >
            Exterior
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {plantas.map((product) => (
            <ProductCard key={product._id} product={product} offers={offers} />
          ))}
        </div>
        {plantas.length === 0 && (
          <p className="text-charcoal/80 text-center py-12">No hay plantas disponibles</p>
        )}
      </div>
    </div>
  )
}
