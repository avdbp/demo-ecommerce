import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useCart } from '../context/CartContext.jsx'
import { useAuth } from '../context/AuthContext.jsx'

export default function ProductCard({ product, offers = [] }) {
  const { addToCart } = useCart()
  const { isLoggedIn } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [added, setAdded] = useState(false)
  const { _id, nombre, categoria, precio, imagen, amount } = product
  const isPlanta = categoria === 'plantas' || categoria === 'planta'
  const inStock = (amount ?? 0) > 0

  const productIdStr = _id?.toString?.() ?? String(_id)
  const offer = offers.find((o) => {
    const offerProductId = o.product?._id?.toString?.() ?? o.product?.toString?.()
    return offerProductId === productIdStr
  })

  const handleAddToCart = (e) => {
    e.preventDefault()
    if (!inStock) return
    if (!isLoggedIn) {
      navigate('/login', { state: { from: location.pathname } })
      return
    }
    const productToAdd = (offer?.offerType === 'precio' && offer?.offerPrice != null)
      ? { ...product, precio: offer.offerPrice }
      : product
    addToCart(productToAdd)
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  return (
    <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden shadow-card hover:shadow-card-hover transition-shadow duration-300 flex flex-col">
      <Link to={`/product/${_id}`} className="block">
        <div className="aspect-square overflow-hidden">
          <img
            src={imagen}
            alt={nombre}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          />
        </div>
        <div className="p-4">
          <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium mb-2 ${
            isPlanta ? 'bg-primary-100 text-primary-700' : 'bg-accent-100 text-accent-600'
          }`}>
            {isPlanta ? 'Planta' : 'Ramo'}
          </span>
          <h3 className="font-semibold text-neutral-900 mb-1">{nombre}</h3>
          {offer ? (
            <div className="mb-2">
              {offer.offerType === 'precio' ? (
                <p>
                  <span className="line-through text-neutral-400 mr-2">€{precio}</span>
                  <span className="font-semibold text-primary-600">€{offer.offerPrice}</span>
                </p>
              ) : (
                <p className="text-sm text-neutral-600">
                  {offer.offerType === 'si_llevas' ? `Si llevas ${offer.buyX} vale €${offer.payY}` : offer.offerText}
                </p>
              )}
            </div>
          ) : isPlanta ? (
            <p className="font-semibold text-primary-600">€{precio}</p>
          ) : (
            <div className="text-sm">
              <p className="font-semibold text-primary-600">€{precio} unidad</p>
              <p className="text-neutral-500">€{(precio * 12).toFixed(2)} docena</p>
            </div>
          )}
          <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium mt-1 ${
            inStock ? 'bg-primary-100 text-primary-700' : 'bg-red-100 text-red-600'
          }`}>
            {inStock ? 'En stock' : 'Sin stock'}
          </span>
        </div>
      </Link>
      <div className="mt-auto px-4 pb-4 flex gap-2" onClick={(e) => e.stopPropagation()}>
        <Link
          to={`/product/${_id}`}
          className="flex-1 text-center py-2.5 border border-neutral-300 text-neutral-700 rounded-lg hover:bg-neutral-50 font-medium text-sm transition-colors"
        >
          Ver
        </Link>
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            handleAddToCart(e)
          }}
          disabled={!inStock}
          className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-colors ${
            inStock
              ? 'bg-primary-500 text-white hover:bg-primary-600'
              : 'bg-neutral-300 text-neutral-500 cursor-not-allowed'
          } ${added ? 'bg-primary-600' : ''}`}
        >
          {added ? '✓ Añadido' : 'Añadir al carrito'}
        </button>
      </div>
    </div>
  )
}
