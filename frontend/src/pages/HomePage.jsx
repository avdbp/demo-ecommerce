import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import ProductCard from '../components/ProductCard.jsx'
import { fetchProducts, fetchActiveOffers } from '../services/api.js'

export default function HomePage() {
  const location = useLocation()
  const [featuredProducts, setFeaturedProducts] = useState([])
  const [featuredLoading, setFeaturedLoading] = useState(true)
  const [offers, setOffers] = useState([])

  useEffect(() => {
    if (location.hash === '#ofertas') {
      document.getElementById('ofertas')?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [location])

  useEffect(() => {
    setFeaturedLoading(true)
    fetchProducts()
      .then((data) => setFeaturedProducts(data.filter((p) => p.favorito)))
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
          <span className="line-through text-red-600 mr-2">€{offer.product?.precio}</span>
          <span className="font-semibold text-red-600">€{offer.offerPrice}</span>
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
      <section className="relative min-h-screen flex items-center justify-center">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: 'url(https://res.cloudinary.com/dqph2qm49/image/upload/v1773096333/rocketMedia/ecommerce_wpqgrm.webp)' }}
        />
        <div className="absolute inset-0 bg-green-dark/50" />
        <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
          <h1 className="font-playfair text-4xl md:text-6xl lg:text-7xl font-bold mb-6">
            Flores y Plantas con Alma
          </h1>
          <p className="text-xl md:text-2xl mb-10 text-white/95">
            Descubre nuestra colección en el corazón de Barcelona
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/plantas"
              className="px-8 py-4 bg-green-mid hover:bg-green-light text-white font-semibold rounded-lg transition-colors"
            >
              Ver Plantas
            </Link>
            <Link
              to="/flores"
              className="px-8 py-4 bg-white/20 hover:bg-white/30 text-white font-semibold rounded-lg border-2 border-white transition-colors"
            >
              Ver Flores
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16 px-4 max-w-7xl mx-auto">
        <h2 className="font-playfair text-3xl md:text-4xl font-bold text-charcoal text-center mb-12">
          Nuestros Favoritos
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredProducts.map((product) => (
            <ProductCard key={product._id} product={product} offers={offers} />
          ))}
        </div>
        {featuredLoading && (
          <p className="text-charcoal/80 text-center py-8">Cargando productos...</p>
        )}
        {!featuredLoading && featuredProducts.length === 0 && (
          <p className="text-charcoal/80 text-center py-8">
            No hay productos marcados como favoritos. Marca productos en el panel de administración para que aparezcan aquí.
          </p>
        )}
      </section>

      <section id="ofertas" className="py-16 px-4 bg-cream">
        <div className="max-w-7xl mx-auto">
          <h2 className="font-playfair text-3xl md:text-4xl font-bold text-charcoal text-center mb-12">
            Ofertas
          </h2>
          {offers.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm p-12 text-center">
              <p className="text-charcoal/70">No hay ofertas activas en este momento</p>
              <p className="text-charcoal/50 text-sm mt-2">Vuelve pronto para descubrir nuestras promociones</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {offers.map((offer) => (
                <div
                  key={offer._id}
                  className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <Link to={`/product/${offer.product?._id}`} className="block">
                    <div className="aspect-square overflow-hidden">
                      <img
                        src={offer.product?.imagen}
                        alt={offer.product?.nombre}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="p-6">
                      <span className="inline-block px-2 py-0.5 rounded text-xs font-medium bg-amber-100 text-amber-800 mb-2">
                        {offer.title}
                      </span>
                      <h3 className="font-playfair text-xl font-semibold text-charcoal mb-2">
                        {offer.product?.nombre}
                      </h3>
                      <div className="text-charcoal/90 text-sm mb-3">
                        {getOfferDescription(offer)}
                      </div>
                      {offer.endDate && (
                        <p className="text-xs text-charcoal/60">
                          Válido hasta {formatDate(offer.endDate)}
                        </p>
                      )}
                      {!offer.endDate && offer.startDate && (
                        <p className="text-xs text-charcoal/60">
                          Desde {formatDate(offer.startDate)}
                        </p>
                      )}
                    </div>
                  </Link>
                  <div className="px-6 pb-6">
                    <Link
                      to={`/product/${offer.product?._id}`}
                      className="block w-full text-center py-2 bg-green-mid text-white rounded-lg hover:bg-green-dark transition-colors text-sm font-medium"
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
