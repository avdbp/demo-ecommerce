const router = require('express').Router();
const Offer = require('../models/Offer.model');
const { isAuthenticated } = require('../middleware/jwt.middleware.js');
const { isAdmin } = require('../middleware/isAdmin.middleware.js');

// Listar ofertas activas (público - para homepage)
// Usamos comparación por fecha (sin hora) para evitar problemas de timezone
router.get('/active', (req, res) => {
  const now = new Date();
  const todayStr = now.toISOString().slice(0, 10); // YYYY-MM-DD

  Offer.find({ active: true })
    .populate('product')
    .sort({ startDate: -1 })
    .lean()
    .then((offers) => {
      const valid = offers.filter((o) => {
        if (o.product == null) return false;
        const startStr = o.startDate ? new Date(o.startDate).toISOString().slice(0, 10) : '';
        const endStr = o.endDate ? new Date(o.endDate).toISOString().slice(0, 10) : null;
        const startOk = startStr && startStr <= todayStr;
        const endOk = endStr == null || endStr >= todayStr;
        return startOk && endOk;
      });
      res.json(valid);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: 'Error al obtener ofertas' });
    });
});

// Listar todas las ofertas (admin)
router.get('/', isAuthenticated, isAdmin, (req, res) => {
  Offer.find()
    .populate('product')
    .sort({ createdAt: -1 })
    .lean()
    .then((offers) => res.json(offers))
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: 'Error al obtener ofertas' });
    });
});

// Debug: todas las ofertas con campos computados para diagnosticar filtros (público)
router.get('/debug', (req, res) => {
  const now = new Date();
  Offer.find()
    .populate('product')
    .sort({ createdAt: -1 })
    .lean()
    .then((offers) => {
      const debug = offers.map((o) => {
        const startOk = o.startDate && new Date(o.startDate) <= now;
        const endOk = o.endDate == null || new Date(o.endDate) >= now;
        const wouldPassDateFilter = startOk && endOk;
        const productId = o.product?._id?.toString?.() ?? o.product?.toString?.() ?? null;
        return {
          _id: o._id,
          title: o.title,
          product: o.product,
          offerType: o.offerType,
          startDate: o.startDate,
          endDate: o.endDate,
          active: o.active,
          wouldPassDateFilter,
          productId,
        };
      });
      res.json({ now: now.toISOString(), offers: debug });
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: 'Error al obtener ofertas debug' });
    });
});

// Detalle de oferta (público - para link "Ver oferta")
router.get('/:id', (req, res) => {
  Offer.findById(req.params.id)
    .populate('product')
    .lean()
    .then((offer) => {
      if (!offer) return res.status(404).json({ error: 'Oferta no encontrada' });
      const now = new Date();
      const isActive =
        offer.active &&
        offer.startDate <= now &&
        (!offer.endDate || offer.endDate >= now);
      res.json({ ...offer, isActive });
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: 'Error al obtener oferta' });
    });
});

// Crear oferta (admin)
router.post('/', isAuthenticated, isAdmin, (req, res) => {
  const {
    title,
    product,
    offerType,
    offerPrice,
    buyX,
    payY,
    offerText,
    startDate,
    endDate,
  } = req.body;

  if (!title || !product || !offerType || !startDate) {
    return res.status(400).json({
      error: 'Título, producto, tipo de oferta y fecha de inicio son obligatorios',
    });
  }

  if (!['precio', 'si_llevas', 'especial'].includes(offerType)) {
    return res.status(400).json({
      error: 'Tipo de oferta debe ser: precio, si_llevas o especial',
    });
  }

  const start = new Date(startDate);
  start.setHours(0, 0, 0, 0);
  let end = null;
  if (endDate) {
    end = new Date(endDate);
    end.setHours(23, 59, 59, 999); // Incluir todo el día de fin
  }
  const data = {
    title: title.trim(),
    product,
    offerType,
    startDate: start,
    endDate: end,
    active: true,
  };

  if (offerType === 'precio') {
    if (offerPrice === undefined || offerPrice === null)
      return res.status(400).json({ error: 'Precio de oferta obligatorio' });
    data.offerPrice = Number(offerPrice);
  } else if (offerType === 'si_llevas') {
    if (buyX === undefined || payY === undefined)
      return res.status(400).json({ error: 'Si llevas X vale Y: ambos valores obligatorios' });
    data.buyX = parseInt(buyX, 10);
    data.payY = Number(payY);
  } else if (offerType === 'especial') {
    if (!offerText || !offerText.trim())
      return res.status(400).json({ error: 'Texto de oferta especial obligatorio' });
    data.offerText = offerText.trim();
  }

  Offer.create(data)
    .then((offer) => offer.populate('product'))
    .then((offer) => res.status(201).json(offer))
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: 'Error al crear oferta' });
    });
});

// Actualizar oferta (admin)
router.put('/:id', isAuthenticated, isAdmin, (req, res) => {
  const {
    title,
    product,
    offerType,
    offerPrice,
    buyX,
    payY,
    offerText,
    startDate,
    endDate,
    active,
  } = req.body;

  const data = {};
  if (title !== undefined) data.title = title.trim();
  if (product !== undefined) data.product = product;
  if (offerType !== undefined) data.offerType = offerType;
  if (startDate !== undefined) data.startDate = new Date(startDate);
  if (endDate !== undefined) {
    if (endDate) {
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      data.endDate = end;
    } else {
      data.endDate = null;
    }
  }
  if (active !== undefined) data.active = active;

  if (offerType === 'precio' || (data.offerType && data.offerType === 'precio')) {
    if (offerPrice !== undefined) data.offerPrice = Number(offerPrice);
  } else if (offerType === 'si_llevas' || (data.offerType && data.offerType === 'si_llevas')) {
    if (buyX !== undefined) data.buyX = parseInt(buyX, 10);
    if (payY !== undefined) data.payY = Number(payY);
  } else if (offerType === 'especial' || (data.offerType && data.offerType === 'especial')) {
    if (offerText !== undefined) data.offerText = offerText.trim();
  }

  Offer.findByIdAndUpdate(req.params.id, data, { new: true })
    .populate('product')
    .then((offer) => {
      if (!offer) return res.status(404).json({ error: 'Oferta no encontrada' });
      res.json(offer);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: 'Error al actualizar oferta' });
    });
});

// Eliminar oferta (admin)
router.delete('/:id', isAuthenticated, isAdmin, (req, res) => {
  Offer.findByIdAndDelete(req.params.id)
    .then((offer) => {
      if (!offer) return res.status(404).json({ error: 'Oferta no encontrada' });
      res.json({ message: 'Oferta eliminada' });
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: 'Error al eliminar oferta' });
    });
});

module.exports = router;
