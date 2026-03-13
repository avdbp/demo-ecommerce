import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import ProductCard from '../components/ProductCard.jsx'
import { fetchProducts, fetchActiveOffers } from '../services/api.js'

export default function HomePage() {
  const location = useLocation()
  const [featuredProducts, setFeaturedProducts] = useState([])
  const [featuredLoading, setFeaturedLoading] = useState(true)
  const [offers, setOffers] = useState([])
  const [ficusProductId, setFicusProductId] = useState(null)

  useEffect(() => {
    if (location.hash === '#ofertas') {
      document.getElementById('ofertas')?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [location])

  useEffect(() => {
    setFeaturedLoading(true)
    fetchProducts()
      .then((data) => {
        setFeaturedProducts(data.filter((p) => p.favorito))
        const ficus = data.find((p) => /ficus/i.test(p.nombre || ''))
        if (ficus) setFicusProductId(ficus._id)
      })
      .catch(() => setFeaturedProducts([]))
      .finally(() => setFeaturedLoading(false))
  }, [])

  useEffect(() => {
    fetchActiveOffers()
      .then(setOffers)
      .catch(() => setOffers([]))
  }, [])

  const formatDate = (d) => {
    if (!d) return ''
    return new Date(d).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    })
  }

  const getOfferDescription = (offer) => {
    if (offer.offerType === 'precio') {
      return (
        <span>
          <span className="line-through text-neutral-400 mr-2">€{offer.product?.precio}</span>
          <span className="font-semibold text-primary-600">€{offer.offerPrice}</span>
        </span>
      )
    }
    if (offer.offerType === 'si_llevas') {
      return (
        <span>
          Si llevas <strong>{offer.buyX}</strong> vale <strong>€{offer.payY}</strong>
        </span>
      )
    }
    if (offer.offerType === 'especial') {
      return <span>{offer.offerText}</span>
    }
    return null
  }

  return (
    <div>
      {/* Hero */}
      <section className="relative h-[70vh] min-h-[500px] flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: 'url(https://res.cloudinary.com/dqph2qm49/image/upload/v1773096333/rocketMedia/ecommerce_wpqgrm.webp)' }}
        />
        <div className="absolute inset-0 bg-neutral-900/55" />
        <div className="relative z-10 text-center text-white px-4 max-w-3xl">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
            Flores y Plantas
          </h1>
          <p className="text-lg md:text-xl text-neutral-200 mb-8 max-w-3xl mx-auto leading-relaxed">
            Este es un demo de ecommerce basado en una floristería que vende flores y plantas. En una parte del proyecto hemos introducido el uso de IA para que nos indique las características principales y los cuidados que debe tener cada planta. Puedes probarlo en la ficha del{' '}
            {ficusProductId ? (
              <Link to={`/product/${ficusProductId}`} className="text-primary-300 hover:text-white underline underline-offset-2 font-medium">
                Ficus
              </Link>
            ) : (
              <Link to="/plantas" className="text-primary-300 hover:text-white underline underline-offset-2 font-medium">
                Ficus
              </Link>
            )}
            . Lo hemos hecho para probar el uso de IA en un proyecto como este y facilitar el trabajo: transcribir esta información manualmente sería sencillo con pocas plantas, pero con un catálogo amplio el esfuerzo se multiplica.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/plantas"
              className="px-8 py-3 bg-primary-500 hover:bg-primary-600 text-white font-semibold rounded-lg transition-colors"
            >
              Ver Plantas
            </Link>
            <Link
              to="/flores"
              className="px-8 py-3 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-lg border border-white/30 transition-colors"
            >
              Ver Flores
            </Link>
          </div>
        </div>
      </section>

      {/* Favoritos */}
      <section className="py-16 px-4 max-w-6xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold text-neutral-900 mb-10">
          Nuestros Favoritos
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredProducts.map((product) => (
            <ProductCard key={product._id} product={product} offers={offers} />
          ))}
        </div>
        {featuredLoading && (
          <p className="text-neutral-500 text-center py-12">Cargando productos...</p>
        )}
        {!featuredLoading && featuredProducts.length === 0 && (
          <p className="text-neutral-500 text-center py-12">
            No hay productos marcados como favoritos.
          </p>
        )}
      </section>

      {/* Ofertas */}
      <section id="ofertas" className="py-16 px-4 bg-neutral-100">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-neutral-900 mb-10">
            Ofertas
          </h2>
          {offers.length === 0 ? (
            <div className="bg-white rounded-xl p-12 text-center shadow-card border border-neutral-200">
              <p className="text-neutral-500">No hay ofertas activas</p>
              <p className="text-neutral-400 text-sm mt-1">Vuelve pronto</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {offers.map((offer) => (
                <div
                  key={offer._id}
                  className="bg-white rounded-xl border border-neutral-200 overflow-hidden hover:shadow-soft transition-shadow"
                >
                  <Link to={`/product/${offer.product?._id}`} className="block">
                    <div className="aspect-square overflow-hidden">
                      <img
                        src={offer.product?.imagen}
                        alt={offer.product?.nombre}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="p-4">
                      <span className="inline-block px-2 py-0.5 rounded text-xs font-medium bg-primary-100 text-primary-700 mb-2">
                        {offer.title}
                      </span>
                      <h3 className="font-semibold text-neutral-900 mb-1">
                        {offer.product?.nombre}
                      </h3>
                      <div className="text-neutral-500 text-sm mb-2">
                        {getOfferDescription(offer)}
                      </div>
                      {(offer.startDate || offer.endDate) && (
                        <p className="text-xs text-neutral-400">
                          {offer.startDate && offer.endDate
                            ? `Desde ${formatDate(offer.startDate)} hasta ${formatDate(offer.endDate)}`
                            : offer.startDate
                              ? `Desde ${formatDate(offer.startDate)}`
                              : `Hasta ${formatDate(offer.endDate)}`}
                        </p>
                      )}
                    </div>
                  </Link>
                  <div className="px-4 pb-4">
                    <Link
                      to={`/product/${offer.product?._id}`}
                      className="block w-full text-center py-2.5 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors text-sm font-medium"
                    >
                      Ver producto
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
