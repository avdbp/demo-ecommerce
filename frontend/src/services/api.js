const API_BASE = '/api';

function getAuthHeaders() {
  const token = localStorage.getItem('authToken');
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
}

export async function fetchProducts() {
  const res = await fetch(`${API_BASE}/products`);
  if (!res.ok) throw new Error('Error al cargar productos');
  return res.json();
}

export async function fetchProduct(id) {
  const res = await fetch(`${API_BASE}/products/${id}`);
  if (!res.ok) throw new Error('Producto no encontrado');
  return res.json();
}

export async function uploadImage(file) {
  const formData = new FormData()
  formData.append('image', file)

  const res = await fetch('/api/upload/image', {
    method: 'POST',
    headers: {
      ...(localStorage.getItem('authToken') && {
        Authorization: `Bearer ${localStorage.getItem('authToken')}`,
      }),
    },
    body: formData,
  })

  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'Error al subir la imagen')
  return data.url
}

export async function deleteProduct(id) {
  const res = await fetch(`${API_BASE}/products/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Error al eliminar producto');
  return data;
}

export async function createProduct(productData) {
  const res = await fetch(`${API_BASE}/products`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(productData),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Error al crear producto');
  return data;
}

export async function updateProduct(id, productData) {
  const res = await fetch(`${API_BASE}/products/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(productData),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Error al actualizar producto');
  return data;
}

export async function fetchPlantInfo(prompt) {
  const res = await fetch(`${API_BASE}/apiAi/info-planta?prompt=${encodeURIComponent(prompt)}`);
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Error al obtener información de la planta');
  return data;
}

export async function login(email, password) {
  const res = await fetch('/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Error al iniciar sesión');
  return data;
}

export async function signup(email, password, firstName, lastName) {
  const res = await fetch('/auth/signup', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, firstName, lastName }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Error al registrarse');
  return data;
}

export async function verifyToken() {
  const token = localStorage.getItem('authToken');
  if (!token) return null;
  const res = await fetch('/auth/verify', {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) return null;
  return res.json();
}

export async function fetchOrders() {
  const res = await fetch(`${API_BASE}/orders`, { headers: getAuthHeaders() });
  if (!res.ok) throw new Error('Error al cargar pedidos');
  return res.json();
}

export async function fetchOrderHistory() {
  const res = await fetch(`${API_BASE}/orders/history`, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error('Error al cargar historial de pedidos');
  return res.json();
}

export async function fetchActiveOffers() {
  const res = await fetch(`${API_BASE}/offers/active`);
  if (!res.ok) throw new Error('Error al cargar ofertas');
  return res.json();
}

export async function fetchOffers() {
  const res = await fetch(`${API_BASE}/offers`, { headers: getAuthHeaders() });
  if (!res.ok) throw new Error('Error al cargar ofertas');
  return res.json();
}

export async function fetchOffer(id) {
  const res = await fetch(`${API_BASE}/offers/${id}`);
  if (!res.ok) throw new Error('Oferta no encontrada');
  return res.json();
}

export async function createOffer(offerData) {
  const res = await fetch(`${API_BASE}/offers`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(offerData),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Error al crear oferta');
  return data;
}

export async function updateOffer(id, offerData) {
  const res = await fetch(`${API_BASE}/offers/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(offerData),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Error al actualizar oferta');
  return data;
}

export async function deleteOffer(id) {
  const res = await fetch(`${API_BASE}/offers/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Error al eliminar oferta');
  return data;
}

export async function createOrder(products, totalAmount) {
  const res = await fetch(`${API_BASE}/orders/create`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({
      products: products.map((p) => ({ product: p._id, amount: p.quantity })),
      totalAmount,
    }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Error al crear pedido');
  return data;
}
