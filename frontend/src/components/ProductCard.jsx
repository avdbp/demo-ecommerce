import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext.jsx'

export default function ProductCard({ product, offers = [] }) {
  const { addToCart } = useCart()
  const [added, setAdded] = useState(false)
  const { _id, nombre, categoria, precio, imagen, amount } = product
  const inStock = (amount ?? 0) > 0
  const isPlanta = categoria === 'plantas' || categoria === 'planta'

  const productIdStr = _id?.toString?.() ?? String(_id)
  const offer = offers.find((o) => {
    const offerProductId = o.product?._id?.toString?.() ?? o.product?.toString?.()
    return offerProductId === productIdStr
  })

  const handleAddToCart = (e) => {
    e.preventDefault()
    if (!inStock) return
    const productToAdd = (offer?.offerType === 'precio' && offer?.offerPrice != null)
      ? { ...product, precio: offer.offerPrice }
      : product
    addToCart(productToAdd)
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  return (
    <div className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
      <Link to={`/product/${_id}`}>
        <div className="aspect-square overflow-hidden">
          <img
            src={imagen}
            alt={nombre}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
        <div className="p-4">
          <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium mb-2 ${
            isPlanta ? 'bg-green-light/20 text-green-dark' : 'bg-blush text-charcoal'
          }`}>
            {isPlanta ? 'Planta' : 'Ramo'}
          </span>
          <h3 className="font-playfair text-lg font-semibold text-charcoal mb-1">{nombre}</h3>
          {offer ? (
            <div className="mb-2">
              {isPlanta ? (
                <p className="font-semibold">
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
                  <p className="text-green-mid font-semibold mb-0.5">
                    €{precio} por unidad · €{(precio * 12).toFixed(2)} por docena
                  </p>
                  <p className="text-sm">
                    <span className="text-red-600 font-medium">En oferta </span>
                    {offer.offerType === 'precio' ? (
                      <span className="text-red-600 font-semibold">€{offer.offerPrice}</span>
                    ) : offer.offerType === 'si_llevas' ? (
                      <span>Si llevas {offer.buyX} vale €{offer.payY}</span>
                    ) : (
                      <span>{offer.offerText}</span>
                    )}
                  </p>
                  {offer.offerType === 'precio' && (
                    <p className="text-xs text-charcoal/80">€{(offer.offerPrice * 12).toFixed(2)} por docena en oferta</p>
                  )}
                </>
              )}
            </div>
          ) : isPlanta ? (
            <p className="text-green-mid font-semibold mb-2">€{precio}</p>
          ) : (
            <div className="text-green-mid font-semibold mb-2 space-y-0.5">
              <p>€{precio} por unidad</p>
              <p className="text-sm font-medium text-charcoal/80">€{(precio * 12).toFixed(2)} por docena</p>
            </div>
          )}
          <span className={`inline-block px-2 py-0.5 rounded text-xs ${
            inStock ? 'bg-green-light/20 text-green-dark' : 'bg-red-100 text-red-700'
          }`}>
            {inStock ? 'En stock' : 'Agotado'}
          </span>
        </div>
      </Link>
      <div className="px-4 pb-4 space-y-2">
        <Link
          to={`/product/${_id}`}
          className="block w-full text-center py-2 bg-green-mid text-white rounded-lg hover:bg-green-dark transition-colors text-sm font-medium"
        >
          Ver detalle
        </Link>
        <button
          onClick={handleAddToCart}
          disabled={!inStock}
          className={`w-full py-2 rounded-lg text-sm font-medium transition-colors ${
            inStock
              ? 'bg-white border-2 border-green-mid text-green-mid hover:bg-green-light/10'
              : 'bg-gray-200 text-gray-500 cursor-not-allowed border-2 border-transparent'
          } ${added ? 'bg-green-dark text-white border-green-dark' : ''}`}
        >
          {added ? '¡Añadido!' : 'Añadir al carrito'}
        </button>
      </div>
    </div>
  )
}
