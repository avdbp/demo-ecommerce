import { useState, useEffect, useRef } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { fetchProduct, updateProduct, uploadImage } from '../../services/api.js'
import { useAuth } from '../../context/AuthContext.jsx'

export default function AdminEditProduct() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { logout } = useAuth()
  const fileInputRef = useRef(null)
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [error, setError] = useState(null)
  const [form, setForm] = useState({
    nombre: '',
    descripcion: '',
    precio: '',
    categoria: 'plantas',
    imagen: '',
    amount: 0,
    favorito: false,
  })

  useEffect(() => {
    fetchProduct(id)
      .then((data) => {
        setProduct(data)
        setForm({
          nombre: data.nombre || '',
          descripcion: data.descripcion || '',
          precio: data.precio ?? '',
          categoria: data.categoria || 'plantas',
          imagen: data.imagen || '',
          amount: data.amount ?? 0,
          favorito: !!data.favorito,
        })
      })
      .catch((err) => {
        setError(err.message)
        setProduct(null)
      })
      .finally(() => setLoading(false))
  }, [id])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
  }

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith('image/')) {
      setError('Selecciona un archivo de imagen (JPG, PNG, etc.)')
      return
    }
    setError(null)
    setUploadingImage(true)
    try {
      const url = await uploadImage(file)
      setForm((prev) => ({ ...prev, imagen: url }))
    } catch (err) {
      setError(err.message)
    } finally {
      setUploadingImage(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setSaving(true)
    try {
      await updateProduct(id, {
        nombre: form.nombre.trim(),
        descripcion: form.descripcion.trim(),
        precio: parseFloat(form.precio) || 0,
        categoria: form.categoria,
        imagen: form.imagen.trim(),
        amount: parseInt(form.amount, 10) || 0,
        favorito: form.favorito,
      })
      navigate('/admin/products')
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <p className="p-8 text-charcoal">Cargando...</p>
  if (error && !product) {
    return (
      <div className="p-8">
        <p className="text-red-600 mb-4">{error}</p>
        <Link to="/admin/products" className="text-green-mid hover:underline">Volver a Productos</Link>
      </div>
    )
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
            className="block py-2 text-green-light/90 hover:text-white transition-colors"
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
      <main className="flex-1 p-8 bg-cream">
        <h1 className="font-playfair text-2xl font-bold text-charcoal mb-8">Editar producto</h1>
        <div className="bg-white rounded-xl shadow-sm p-6 max-w-2xl">
          {error && (
            <p className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm">{error}</p>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-charcoal mb-2">Nombre *</label>
              <input
                name="nombre"
                type="text"
                required
                value={form.nombre}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-mid outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-charcoal mb-2">Descripción</label>
              <textarea
                name="descripcion"
                rows={4}
                value={form.descripcion}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-mid outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-charcoal mb-2">Precio (€) *</label>
              <input
                name="precio"
                type="number"
                required
                min="0"
                step="0.01"
                value={form.precio}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-mid outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-charcoal mb-2">Stock</label>
              <input
                name="amount"
                type="number"
                min="0"
                value={form.amount}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-mid outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-charcoal mb-2">Categoría *</label>
              <select
                name="categoria"
                required
                value={form.categoria}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-mid outline-none"
              >
                <option value="plantas">Plantas</option>
                <option value="ramos">Ramos</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-charcoal mb-2">Imagen</label>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={uploadingImage}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-mid outline-none file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-green-mid file:text-white file:cursor-pointer disabled:opacity-50"
              />
              {uploadingImage && <p className="mt-1 text-sm text-charcoal/70">Subiendo imagen...</p>}
              {form.imagen && (
                <div className="mt-2">
                  <img src={form.imagen} alt="Vista previa" className="h-24 object-cover rounded-lg border" />
                  <button
                    type="button"
                    onClick={() => setForm((prev) => ({ ...prev, imagen: '' }))}
                    className="mt-1 text-sm text-red-600 hover:underline"
                  >
                    Quitar imagen
                  </button>
                </div>
              )}
            </div>
            <div className="flex items-center gap-2">
              <input
                id="favorito"
                name="favorito"
                type="checkbox"
                checked={form.favorito}
                onChange={handleChange}
                className="rounded border-gray-300"
              />
              <label htmlFor="favorito" className="text-sm text-charcoal">
                Mostrar en Nuestros Favoritos (homepage)
              </label>
            </div>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2 bg-green-mid text-white rounded-lg hover:bg-green-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? 'Guardando...' : 'Guardar'}
            </button>
          </form>
        </div>
      </main>
    </div>
  )
}
