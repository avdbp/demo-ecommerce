const express = require('express');
const router = express.Router();
const multer = require('multer');
const streamifier = require('streamifier');
const cloudinary = require('cloudinary').v2;
const { isAuthenticated } = require('../middleware/jwt.middleware.js');
const { isAdmin } = require('../middleware/isAdmin.middleware.js');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

const upload = multer({ storage: multer.memoryStorage() });

router.post('/image', isAuthenticated, isAdmin, upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No se envió ninguna imagen' });
  }

  if (!process.env.CLOUDINARY_NAME || !process.env.CLOUDINARY_SECRET) {
    return res.status(500).json({ error: 'Cloudinary no está configurado en el servidor' });
  }

  const stream = cloudinary.uploader.upload_stream(
    { folder: 'ecommerce-products' },
    (err, result) => {
      if (err) {
        console.error('Cloudinary upload error:', err);
        return res.status(500).json({ error: err.message || 'Error al subir la imagen' });
      }
      // URL optimizada: q_auto (calidad automática), f_auto (webp/avif según navegador), w_1200 (máx 1200px)
      const optimizedUrl = result.secure_url.replace(
        '/upload/',
        '/upload/q_auto,f_auto,w_1200,c_limit/'
      );
      res.json({ url: optimizedUrl });
    }
  );

  streamifier.createReadStream(req.file.buffer).pipe(stream);
});

module.exports = router;
