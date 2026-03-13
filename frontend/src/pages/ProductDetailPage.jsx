import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom'
import { useCart } from '../context/CartContext.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { fetchProduct, fetchPlantInfo, fetchActiveOffers } from '../services/api.js'

export default function ProductDetailPage() {
  const { id } = useParams()
  const { addToCart } = useCart()
  const { isLoggedIn } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
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
        <p className="text-neutral-500">Cargando...</p>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="pt-24 pb-16 px-4 min-h-screen text-center">
        <p className="text-neutral-900">Producto no encontrado</p>
        <Link to="/" className="text-primary-600 hover:text-primary-700 mt-4 inline-block font-medium">
          Volver al inicio
        </Link>
      </div>
    )
  }

  const { nombre, categoria, precio, imagen, descripcion } = product
  const amount = product.amount ?? 0
  const isPlanta = categoria === 'plantas' || categoria === 'planta'
  const inStock = (amount ?? 0) > 0
  const productIdStr = id?.toString?.() ?? String(id)
  const offer = offers.find((o) => {
    const offerProductId = o.product?._id?.toString?.() ?? o.product?.toString?.()
    return offerProductId === productIdStr
  })

  const handleAddToCart = () => {
    if (!inStock) return
    if (!isLoggedIn) {
      navigate('/login', { state: { from: location.pathname } })
      return
    }
    const productToAdd = offer?.offerType === 'precio' && offer?.offerPrice != null
      ? { ...product, precio: offer.offerPrice }
      : product
    addToCart(productToAdd)
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  return (
    <div className="pt-24 pb-20 px-4 min-h-screen bg-neutral-50">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 lg:gap-16">
          <div className="rounded-xl overflow-hidden border border-neutral-200 shadow-card-lg">
            <img
              src={imagen}
              alt={nombre}
              className="w-full aspect-square object-cover"
            />
          </div>
          <div>
            <span className={`inline-block px-2.5 py-1 rounded-lg text-sm font-medium mb-3 ${
              isPlanta ? 'bg-primary-100 text-primary-700' : 'bg-accent-100 text-accent-600'
            }`}>
              {isPlanta ? 'Planta' : 'Ramo'}
            </span>
            <h1 className="font-bold text-3xl md:text-4xl font-semibold text-neutral-900 mb-4 tracking-tight">
              {nombre}
            </h1>
            {offer ? (
              <div className="mb-2">
                {isPlanta ? (
                  <p className="text-2xl font-semibold">
                    <span className="line-through text-neutral-400 mr-2">€{precio}</span>
                    {offer.offerType === 'precio' ? (
                      <span className="text-primary-600">€{offer.offerPrice}</span>
                    ) : (
                      <>
                        <span className="text-neutral-500">en oferta </span>
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
                    <p className="text-primary-600 text-2xl font-semibold mb-1">
                      €{precio} por unidad · €{(precio * 12).toFixed(2)} por docena
                    </p>
                    <p className="text-lg text-neutral-500">
                      <span className="text-primary-600 font-semibold">En oferta </span>
                      {offer.offerType === 'precio' ? (
                        <span className="text-primary-600 font-semibold">€{offer.offerPrice}</span>
                      ) : offer.offerType === 'si_llevas' ? (
                        <span>Si llevas {offer.buyX} vale €{offer.payY}</span>
                      ) : (
                        <span>{offer.offerText}</span>
                      )}
                    </p>
                    {offer.offerType === 'precio' && (
                      <p className="text-neutral-500">€{(offer.offerPrice * 12).toFixed(2)} por docena en oferta</p>
                    )}
                  </>
                )}
              </div>
            ) : isPlanta ? (
              <p className="text-primary-600 text-2xl font-semibold mb-2">€{precio}</p>
            ) : (
              <div className="mb-2">
                <p className="text-primary-600 text-2xl font-semibold">€{precio} por unidad</p>
                <p className="text-primary-600 text-lg font-medium text-neutral-500">€{(precio * 12).toFixed(2)} por docena</p>
              </div>
            )}
            <span className={`inline-block px-2.5 py-1 rounded-lg text-sm mb-6 ${
              inStock ? 'bg-primary-100 text-primary-700' : 'bg-red-100 text-red-600'
            }`}>
              {inStock ? 'En stock' : 'Sin stock'}
            </span>
            <p className="text-neutral-500 mb-8 text-pretty leading-relaxed">
              {descripcion || 'Producto de nuestra tienda. Descubre la calidad y el cuidado que ponemos en cada detalle.'}
            </p>
            <button
              onClick={handleAddToCart}
              disabled={!inStock}
              className={`w-full py-4 rounded-lg font-semibold transition-all duration-300 ${
                inStock
                  ? 'bg-primary-500 hover:bg-primary-600 text-white'
                  : 'bg-neutral-300 text-neutral-500 cursor-not-allowed'
              } ${added ? 'bg-primary-600' : ''}`}
            >
              {added ? '¡Añadido al carrito!' : 'Añadir al carrito'}
            </button>
          </div>
        </div>

        {isPlanta && (
          <div className="mt-20 p-8 bg-neutral-100 rounded-xl border border-neutral-200">
            <h3 className="font-bold text-xl font-semibold text-neutral-900 mb-4">
              🌿 Información sobre esta planta
            </h3>
            <button
              onClick={handleGenerateAiInfo}
              disabled={aiLoading}
              className="px-5 py-2.5 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors mb-4 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
            >
              {aiLoading ? 'Generando...' : 'Generar información con IA'}
            </button>
            <div className="bg-neutral-50 rounded-xl p-6 min-h-[80px] border border-neutral-200">
              {aiInfo ? (
                <p className="text-neutral-600 whitespace-pre-wrap text-pretty">{aiInfo}</p>
              ) : (
                <p className="text-neutral-400 text-center">La información aparecerá aquí al pulsar el botón</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
