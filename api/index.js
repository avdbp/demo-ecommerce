// Vercel Serverless entry point
// Variables de entorno se inyectan directamente por Vercel (no necesitamos .env)
require('../backend/db');

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');

const app = express();

const FRONTEND_URL = process.env.ORIGIN || 'http://localhost:5173';

app.use(
  cors({
    origin: [FRONTEND_URL, 'http://localhost:5173'],
    credentials: true,
  })
);
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Rutas
const indexRoutes = require('../backend/routes/index.routes');
const authRoutes = require('../backend/routes/auth.routes');
const productsRoutes = require('../backend/routes/products.routes');
const uploadRoutes = require('../backend/routes/upload.routes');
const apiAIRoutes = require('../backend/routes/apiAi.routes');
const ordersRoutes = require('../backend/routes/orders.routes');
const offersRoutes = require('../backend/routes/offers.routes');

app.use('/api', indexRoutes);
app.use('/api/products', productsRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/apiAi', apiAIRoutes);
app.use('/api/orders', ordersRoutes);
app.use('/api/offers', offersRoutes);
app.use('/auth', authRoutes);

// 404
app.use((req, res) => {
  res.status(404).json({ message: 'This route does not exist' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('ERROR', req.method, req.path, err);
  if (!res.headersSent) {
    res.status(500).json({
      message: 'Internal server error. Check the server console',
    });
  }
});

module.exports = app;
