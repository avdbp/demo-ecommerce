const router = require('express').Router();
const Orders = require('../models/Orders.model');
const mongoose = require('mongoose');
const Storage = require('../models/Storage.model');
const { isAuthenticated } = require('../middleware/jwt.middleware.js');

// Historial de pedidos del usuario
router.get('/history', isAuthenticated, async (req, res) => {
  const userId = req.payload._id;
  try {
    const userOrders = await Orders.find({ usuario: userId })
      .populate({ path: 'products', populate: { path: 'product' } });
    res.json(userOrders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener el historial de pedidos.' });
  }
});

// Lista de todos los pedidos (admin)
router.get('/', async (req, res) => {
  Orders.find()
    .populate([
      { path: 'products', populate: { path: 'product' } },
      { path: 'usuario' },
    ])
    .then((data) => res.json(data))
    .catch((error) => res.status(500).json({ error: error.message }));
});

// Crear pedido (sin Stripe por ahora - solo guarda en BD)
router.post('/create', isAuthenticated, async (req, res) => {
  const { products, totalAmount } = req.body;
  const usuario = req.payload._id;

  if (!products || !Array.isArray(products) || products.length === 0) {
    return res.status(400).json({ error: 'Debes enviar productos' });
  }

  const productsOID = products.map((p) => ({
    product: new mongoose.Types.ObjectId(p.product),
    amount: p.amount,
  }));

  Orders.create({
    products: productsOID,
    usuario,
    state: 'Pendiente',
  })
    .then(async (order) => {
      const updates = products.map(({ product, amount }) =>
        Storage.findOneAndUpdate({ product }, { $inc: { amount: -amount } })
      );
      await Promise.all(updates);
      res.json(order);
    })
    .catch((err) => res.status(500).json({ error: err.message }));
});

module.exports = router;
