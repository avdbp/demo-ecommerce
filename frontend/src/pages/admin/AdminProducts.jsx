import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { fetchProducts, deleteProduct } from '../../services/api.js'
import { useAuth } from '../../context/AuthContext.jsx'

export default function AdminProducts() {
  const navigate = useNavigate()
  const { logout } = useAuth()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const loadProducts = () => {
    return fetchProducts()
      .then(setProducts)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    loadProducts()
  }, [])

  const handleDelete = async (id, nombre) => {
    if (!window.confirm(`¿Eliminar "${nombre}"?`)) return
    try {
      await deleteProduct(id)
      setProducts((prev) => prev.filter((p) => p._id !== id))
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="flex min-h-screen">
      <aside className="w-64 bg-green-dark text-white p-6 flex flex-col">
        <Link to="/" className="font-playfair text-xl font-semibold mb-8 block text-white hover:text-green-light">
            Inicio
          </Link>
        <nav className="space-y-2 flex-1">
          <Link
            to="/admin/products"
            className="block py-2 text-white font-medium"
          >
            Productos
          </Link>
          <Link
            to="/admin/add-product"
            className="block py-2 text-green-light/90 hover:text-white transition-colors"
          >
            Añadir producto
          </Link>
          <Link
            to="/admin/offers"
            className="block py-2 text-green-light/90 hover:text-white transition-colors"
          >
            Ofertas
          </Link>
          <Link
            to="/admin/add-offer"
            className="block py-2 text-green-light/90 hover:text-white transition-colors"
          >
            Crear oferta
          </Link>
          <Link
            to="/admin/orders"
            className="block py-2 text-green-light/90 hover:text-white transition-colors"
          >
            Pedidos
          </Link>
        </nav>
        <button
          onClick={() => { logout(); navigate('/'); }}
          className="mt-4 py-2 text-green-light/90 hover:text-white transition-colors text-left"
        >
          Cerrar sesión
        </button>
      </aside>
      <main className="flex-1 p-8 bg-cream overflow-x-auto">
        <h1 className="font-playfair text-2xl font-bold text-charcoal mb-8">Productos</h1>
        {loading && <p className="text-charcoal">Cargando productos...</p>}
        {error && <p className="text-red-600 mb-4">{error}</p>}
        {!loading && !error && products.length === 0 && (
          <p className="text-charcoal/80">No hay productos. Añade el primero desde Añadir producto.</p>
        )}
        {!loading && !error && products.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-charcoal uppercase">Imagen</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-charcoal uppercase">Nombre</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-charcoal uppercase">Categoría</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-charcoal uppercase">Precio</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-charcoal uppercase">Stock</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-charcoal uppercase">Favorito</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-charcoal uppercase">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {products.map((product) => (
                  <tr key={product._id}>
                    <td className="px-6 py-4">
                      {product.imagen ? (
                        <img
                          src={product.imagen}
                          alt={product.nombre}
                          className="w-12 h-12 object-cover rounded"
                        />
                      ) : (
                        <span className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center text-xs text-gray-500">Sin</span>
                      )}
                    </td>
                    <td className="px-6 py-4 font-medium text-charcoal">{product.nombre}</td>
                    <td className="px-6 py-4 text-charcoal/80">{product.categoria}</td>
                    <td className="px-6 py-4 text-green-mid font-semibold">€{product.precio}</td>
                    <td className="px-6 py-4">{product.amount ?? 0}</td>
                    <td className="px-6 py-4">
                      {product.favorito ? (
                        <span className="text-amber-500" title="En Nuestros Favoritos">★</span>
                      ) : (
                        <span className="text-gray-300">—</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link
                        to={`/admin/edit-product/${product._id}`}
                        className="text-green-mid hover:text-green-dark mr-4"
                      >
                        Editar
                      </Link>
                      <button
                        type="button"
                        onClick={() => handleDelete(product._id, product.nombre)}
                        className="text-red-600 hover:text-red-700"
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  )
}
