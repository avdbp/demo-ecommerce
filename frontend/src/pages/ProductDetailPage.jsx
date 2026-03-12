import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useCart } from '../context/CartContext.jsx'
import { fetchProduct, fetchPlantInfo, fetchActiveOffers } from '../services/api.js'

export default function ProductDetailPage() {
  const { id } = useParams()
  const { addToCart } = useCart()
  const [added, setAdded] = useState(false)
  const [product, setProduct] = useState(null)
  const [offers, setOffers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [aiInfo, setAiInfo] = useState(null)
  const [aiLoading, setAiLoading] = useState(false)

  useEffect(() => {
    fetchProduct(id)
      .then(setProduct)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [id])

  useEffect(() => {
    fetchActiveOffers().then(setOffers).catch(() => setOffers([]))
  }, [])

  const handleGenerateAiInfo = () => {
    if (!product?.nombre) return
    setAiLoading(true)
    setAiInfo(null)
    fetchPlantInfo(product.nombre)
      .then((data) => setAiInfo(data.planta))
      .catch((err) => setAiInfo(`Error: ${err.message}`))
      .finally(() => setAiLoading(false))
  }

  if (loading) {
    return (
      <div className="pt-24 pb-16 px-4 min-h-screen flex items-center justify-center">
        <p className="text-charcoal">Cargando...</p>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="pt-24 pb-16 px-4 min-h-screen text-center">
        <p className="text-charcoal">Producto no encontrado</p>
        <Link to="/" className="text-green-mid hover:underline mt-4 inline-block">Volver al inicio</Link>
      </div>
    )
  }

  const { nombre, categoria, precio, imagen, descripcion } = product
  const amount = product.amount ?? 0
  const inStock = amount > 0
  const isPlanta = categoria === 'plantas' || categoria === 'planta'
  const productIdStr = id?.toString?.() ?? String(id)
  const offer = offers.find((o) => {
    const offerProductId = o.product?._id?.toString?.() ?? o.product?.toString?.()
    return offerProductId === productIdStr
  })

  const handleAddToCart = () => {
    const productToAdd = offer?.offerType === 'precio' && offer?.offerPrice != null
      ? { ...product, precio: offer.offerPrice }
      : product
    addToCart(productToAdd)
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  return (
    <div className="pt-24 pb-16 px-4 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12">
          <div className="rounded-xl overflow-hidden shadow-lg">
            <img
              src={imagen}
              alt={nombre}
              className="w-full aspect-square object-cover"
            />
          </div>
          <div>
            <span className={`inline-block px-2 py-0.5 rounded text-sm font-medium mb-2 ${
              isPlanta ? 'bg-green-light/20 text-green-dark' : 'bg-blush text-charcoal'
            }`}>
              {isPlanta ? 'Planta' : 'Ramo'}
            </span>
            <h1 className="font-playfair text-3xl md:text-4xl font-bold text-charcoal mb-4">
              {nombre}
            </h1>
            {offer ? (
              <div className="mb-2">
                {isPlanta ? (
                  <p className="text-2xl font-semibold">
                    <span className="line-through text-red-600 mr-2">€{precio}</span>
                    {offer.offerType === 'precio' ? (
                      <span className="text-red-600">€{offer.offerPrice}</span>
                    ) : (
                      <>
                        <span className="text-charcoal/80">en oferta </span>
                        {offer.offerType === 'si_llevas' ? (
                          <span>Si llevas {offer.buyX} vale €{offer.payY}</span>
                        ) : (
                          <span>{offer.offerText}</span>
                        )}
                      </>
                    )}
                  </p>
                ) : (
                  <>
                    <p className="text-green-mid text-2xl font-semibold mb-1">
                      €{precio} por unidad · €{(precio * 12).toFixed(2)} por docena
                    </p>
                    <p className="text-lg">
                      <span className="text-red-600 font-semibold">En oferta </span>
                      {offer.offerType === 'precio' ? (
                        <span className="text-green-mid font-semibold">€{offer.offerPrice}</span>
                      ) : offer.offerType === 'si_llevas' ? (
                        <span>Si llevas {offer.buyX} vale €{offer.payY}</span>
                      ) : (
                        <span>{offer.offerText}</span>
                      )}
                    </p>
                    {offer.offerType === 'precio' && (
                      <p className="text-charcoal/80">€{(offer.offerPrice * 12).toFixed(2)} por docena en oferta</p>
                    )}
                  </>
                )}
              </div>
            ) : isPlanta ? (
              <p className="text-green-mid text-2xl font-semibold mb-2">€{precio}</p>
            ) : (
              <div className="mb-2">
                <p className="text-green-mid text-2xl font-semibold">€{precio} por unidad</p>
                <p className="text-green-mid text-lg font-medium text-charcoal/80">€{(precio * 12).toFixed(2)} por docena</p>
              </div>
            )}
            <span className={`inline-block px-2 py-0.5 rounded text-sm mb-6 ${
              inStock ? 'bg-green-light/20 text-green-dark' : 'bg-red-100 text-red-700'
            }`}>
              {inStock ? 'En stock' : 'Agotado'}
            </span>
            <p className="text-charcoal/80 mb-8">
              {descripcion || 'Producto de nuestra tienda. Descubre la calidad y el cuidado que ponemos en cada detalle.'}
            </p>
            <button
              onClick={handleAddToCart}
              disabled={!inStock}
              className={`w-full py-3 rounded-lg font-semibold transition-colors ${
                inStock
                  ? 'bg-green-mid hover:bg-green-dark text-white'
                  : 'bg-gray-200 text-gray-500 cursor-not-allowed'
              } ${added ? 'bg-green-dark' : ''}`}
            >
              {added ? '¡Añadido al carrito!' : 'Añadir al carrito'}
            </button>
          </div>
        </div>

        {isPlanta && (
          <div className="mt-16 p-6 bg-cream rounded-xl border border-gray-200">
            <h3 className="font-playfair text-xl font-semibold text-charcoal mb-4">
              🌿 Información sobre esta planta
            </h3>
            <button
              onClick={handleGenerateAiInfo}
              disabled={aiLoading}
              className="px-4 py-2 bg-green-mid text-white rounded-lg hover:bg-green-dark transition-colors mb-4 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {aiLoading ? 'Generando...' : 'Generar información con IA'}
            </button>
            <div className="bg-white rounded-lg p-6 min-h-[80px] border border-gray-200">
              {aiInfo ? (
                <p className="text-charcoal whitespace-pre-wrap">{aiInfo}</p>
              ) : (
                <p className="text-gray-500 text-center">La información aparecerá aquí al pulsar el botón</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
