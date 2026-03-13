import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import AdminLayout from '../../components/AdminLayout.jsx'
import { createProduct, uploadImage } from '../../services/api.js'

export default function AdminAddProduct() {
  const navigate = useNavigate()
  const fileInputRef = useRef(null)
  const [loading, setLoading] = useState(false)
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
    interior: false,
    exterior: false,
  })

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
  }

  const handleUbicacionChange = (key) => {
    setForm((prev) => ({ ...prev, [key]: !prev[key] }))
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
    setLoading(true)
    try {
      await createProduct({
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
      setLoading(false)
    }
  }

  return (
    <AdminLayout title="Añadir producto">
      <div className="bg-white rounded-xl shadow-card p-6 max-w-2xl">
        {error && (
          <p className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm">{error}</p>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-neutral-900 mb-2">Nombre *</label>
            <input
              name="nombre"
              type="text"
              required
              placeholder="Nombre del producto"
              value={form.nombre}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-900 mb-2">Descripción</label>
            <textarea
              name="descripcion"
              placeholder="Descripción"
              rows={4}
              value={form.descripcion}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-900 mb-2">Precio (€) *</label>
            <input
              name="precio"
              type="number"
              required
              min="0"
              step="0.01"
              placeholder="0"
              value={form.precio}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-900 mb-2">Stock inicial</label>
            <input
              name="amount"
              type="number"
              min="0"
              placeholder="0"
              value={form.amount}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-900 mb-2">Categoría *</label>
            <select
              name="categoria"
              required
              value={form.categoria}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
            >
              <option value="plantas">Plantas</option>
              <option value="ramos">Ramos</option>
            </select>
          </div>
          {form.categoria === 'plantas' && (
            <div>
              <label className="block text-sm font-medium text-neutral-900 mb-2">Ubicación (puedes marcar ambas)</label>
              <div className="flex gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={form.interior} onChange={() => handleUbicacionChange('interior')} className="rounded border-neutral-300" />
                  <span className="text-neutral-900">Interior</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={form.exterior} onChange={() => handleUbicacionChange('exterior')} className="rounded border-neutral-300" />
                  <span className="text-neutral-900">Exterior</span>
                </label>
              </div>
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-neutral-900 mb-2">Imagen</label>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              disabled={uploadingImage}
              className="w-full px-4 py-2 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-primary-500 file:text-white file:cursor-pointer disabled:opacity-50"
            />
            {uploadingImage && <p className="mt-1 text-sm text-neutral-500">Subiendo imagen...</p>}
            {form.imagen && (
              <div className="mt-2">
                <img src={form.imagen} alt="Vista previa" className="h-24 object-cover rounded-lg border" />
                <button type="button" onClick={() => setForm((prev) => ({ ...prev, imagen: '' }))} className="mt-1 text-sm text-red-600 hover:underline">
                  Quitar imagen
                </button>
              </div>
            )}
            <p className="mt-1 text-xs text-neutral-500">Sube una foto desde tu dispositivo (se sube a Cloudinary)</p>
          </div>
          <div className="flex items-center gap-2">
            <input id="favorito" name="favorito" type="checkbox" checked={form.favorito} onChange={handleChange} className="rounded border-neutral-300" />
            <label htmlFor="favorito" className="text-sm text-neutral-900">Mostrar en Nuestros Favoritos (homepage)</label>
          </div>
          <button type="submit" disabled={loading} className="px-6 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium">
            {loading ? 'Guardando...' : 'Crear producto'}
          </button>
        </form>
      </div>
    </AdminLayout>
  )
}
