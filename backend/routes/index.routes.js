const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.json({ message: 'E-commerce Demo API running' });
});

module.exports = router;
