import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import AdminLayout from '../../components/AdminLayout.jsx'
import { fetchProducts, deleteProduct } from '../../services/api.js'

export default function AdminProducts() {
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
    <AdminLayout title="Productos (Inventario)">
      {loading && <p className="text-neutral-600">Cargando productos...</p>}
      {error && <p className="text-red-600 mb-4">{error}</p>}
      {!loading && !error && products.length === 0 && (
        <p className="text-neutral-600">
          No hay productos. <Link to="/admin/add-product" className="text-primary-600 hover:underline">Añade el primero</Link>.
        </p>
      )}
      {!loading && !error && products.length > 0 && (
        <div className="bg-white rounded-xl shadow-card overflow-hidden">
          <table className="w-full">
            <thead className="bg-neutral-100">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-600 uppercase">Imagen</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-600 uppercase">Nombre</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-600 uppercase">Categoría</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-600 uppercase">Precio</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-600 uppercase">Stock</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-600 uppercase">Favorito</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-neutral-600 uppercase">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200">
              {products.map((product) => (
                <tr key={product._id} className="hover:bg-neutral-50">
                  <td className="px-6 py-4">
                    {product.imagen ? (
                      <img src={product.imagen} alt={product.nombre} className="w-12 h-12 object-cover rounded-lg" />
                    ) : (
                      <span className="w-12 h-12 bg-neutral-200 rounded-lg flex items-center justify-center text-xs text-neutral-500">Sin</span>
                    )}
                  </td>
                  <td className="px-6 py-4 font-medium text-neutral-900">{product.nombre}</td>
                  <td className="px-6 py-4 text-neutral-600">{product.categoria}</td>
                  <td className="px-6 py-4 text-primary-600 font-semibold">€{product.precio}</td>
                  <td className="px-6 py-4">{product.amount ?? 0}</td>
                  <td className="px-6 py-4">
                    {product.favorito ? <span className="text-amber-500" title="En Nuestros Favoritos">★</span> : <span className="text-neutral-300">—</span>}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link to={`/admin/edit-product/${product._id}`} className="text-primary-600 hover:text-primary-700 mr-4 font-medium">
                      Editar
                    </Link>
                    <button type="button" onClick={() => handleDelete(product._id, product.nombre)} className="text-red-600 hover:text-red-700 font-medium">
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AdminLayout>
  )
}
