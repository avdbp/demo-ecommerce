const router = require('express').Router();
const Product = require('../models/Product.model');
const Storage = require('../models/Storage.model');
const { isAuthenticated } = require('../middleware/jwt.middleware.js');
const { isAdmin } = require('../middleware/isAdmin.middleware.js');

// Crear producto (admin)
router.post('/', isAuthenticated, isAdmin, (req, res) => {
  const { nombre, descripcion, precio, categoria, imagen, amount, favorito } = req.body;

  if (!nombre || !precio || !categoria) {
    return res.status(400).json({ error: 'Nombre, precio y categoría son obligatorios' });
  }

  if (!['plantas', 'ramos'].includes(categoria)) {
    return res.status(400).json({ error: 'Categoría debe ser "plantas" o "ramos"' });
  }

  Product.create({
    nombre,
    descripcion: descripcion || '',
    precio: Number(precio),
    categoria,
    imagen: imagen || '',
    favorito: !!favorito,
  })
    .then((product) => {
      return Storage.create({ product: product._id, amount: Number(amount) || 0 }).then(() => product);
    })
    .then((product) => res.status(201).json(product))
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: 'Error al crear producto' });
    });
});

// Lista de productos (con stock si existe)
router.get('/', (req, res) => {
  Product.find()
    .lean()
    .then(async (products) => {
      const storages = await Storage.find({ product: { $in: products.map((p) => p._id) } });
      const storageMap = Object.fromEntries(storages.map((s) => [s.product.toString(), s.amount]));
      const data = products.map((p) => ({
        ...p,
        amount: storageMap[p._id.toString()] ?? 0,
      }));
      res.json(data);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: 'Error al obtener productos' });
    });
});

// Actualizar producto (admin)
router.put('/:id', isAuthenticated, isAdmin, (req, res) => {
  const { id } = req.params;
  const { nombre, descripcion, precio, categoria, imagen, amount, favorito } = req.body;

  if (!nombre || precio === undefined || !categoria) {
    return res.status(400).json({ error: 'Nombre, precio y categoría son obligatorios' });
  }

  if (!['plantas', 'ramos'].includes(categoria)) {
    return res.status(400).json({ error: 'Categoría debe ser "plantas" o "ramos"' });
  }

  Product.findByIdAndUpdate(
    id,
    {
      nombre: nombre.trim(),
      descripcion: descripcion || '',
      precio: Number(precio),
      categoria,
      imagen: imagen || '',
      ...(favorito !== undefined && { favorito: !!favorito }),
    },
    { new: true }
  )
    .then((product) => {
      if (!product) return res.status(404).json({ error: 'Producto no encontrado' });
      return Storage.findOneAndUpdate(
        { product: id },
        { amount: Math.max(0, parseInt(amount, 10) || 0) },
        { upsert: true, new: true }
      ).then(() => product);
    })
    .then(async (product) => {
      const storage = await Storage.findOne({ product: id });
      const toSend = product.toJSON();
      toSend.amount = storage?.amount ?? 0;
      res.json(toSend);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: 'Error al actualizar producto' });
    });
});

// Eliminar producto (admin)
router.delete('/:id', isAuthenticated, isAdmin, (req, res) => {
  const { id } = req.params;
  Product.findByIdAndDelete(id)
    .then((product) => {
      if (!product) return res.status(404).json({ error: 'Producto no encontrado' });
      return Storage.findOneAndDelete({ product: id }).then(() => product);
    })
    .then(() => res.json({ message: 'Producto eliminado' }))
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: 'Error al eliminar producto' });
    });
});

// Detalle de producto con stock
router.get('/:id', (req, res) => {
  const id = req.params.id;
  Product.findById(id)
    .then((dataProduct) => {
      if (!dataProduct) {
        return res.status(404).json({ error: 'Producto no encontrado' });
      }
      Storage.findOne({ product: id })
        .then((dataStorage) => {
          const toSend = dataProduct.toJSON();
          toSend.amount = dataStorage?.amount ?? 0;
          res.json(toSend);
        })
        .catch(() => {
          const toSend = dataProduct.toJSON();
          toSend.amount = 0;
          res.json(toSend);
        });
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: 'Error al obtener producto' });
    });
});

// Stock de un producto
router.get('/:id/storage', (req, res) => {
  Storage.findOne({ product: req.params.id })
    .then((data) => res.json({ amount: data ? data.amount : 0 }))
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: 'Error al obtener stock' });
    });
});

module.exports = router;
