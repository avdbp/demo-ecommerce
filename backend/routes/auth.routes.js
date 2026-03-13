const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User.model');
const { isAuthenticated } = require('../middleware/jwt.middleware.js');

const saltRounds = 10;

// POST /auth/signup
router.post('/signup', (req, res, next) => {
  const { email, password, firstName, lastName, username } = req.body;

  if (email === '' || password === '' || firstName === '' || lastName === '' || !username || username.trim() === '') {
    res.status(400).json({ message: 'Proporciona email, contraseña, nombre, apellido y nombre de usuario.' });
    return;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  if (!emailRegex.test(email)) {
    res.status(400).json({ message: 'Proporciona una dirección de email válida.' });
    return;
  }

  const usernameTrimmed = username.trim().toLowerCase();
  if (usernameTrimmed.length < 3) {
    res.status(400).json({ message: 'El nombre de usuario debe tener al menos 3 caracteres.' });
    return;
  }

  const passwordRegex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
  if (!passwordRegex.test(password)) {
    res.status(400).json({
      message:
        'La contraseña debe tener al menos 6 caracteres, un número, una minúscula y una mayúscula.',
    });
    return;
  }

  User.findOne({ $or: [{ email: email.toLowerCase() }, { username: usernameTrimmed }] })
    .then((foundUser) => {
      if (foundUser) {
        if (foundUser.email === email.toLowerCase()) {
          res.status(400).json({ message: 'Ya existe un usuario con ese correo electrónico.' });
        } else {
          res.status(400).json({ message: 'Ya existe un usuario con ese nombre de usuario.' });
        }
        return;
      }
      const salt = bcrypt.genSaltSync(saltRounds);
      const hashedPassword = bcrypt.hashSync(password, salt);
      return User.create({
        email: email.toLowerCase(),
        username: usernameTrimmed,
        password: hashedPassword,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
      });
    })
    .then((createdUser) => {
      if (!createdUser) return;
      const { email: e, firstName: fn, lastName: ln, username: u, _id } = createdUser;
      res.status(201).json({ user: { email: e, firstName: fn, lastName: ln, username: u, _id } });
    })
    .catch((err) => next(err));
});

// POST /auth/login
router.post('/login', (req, res, next) => {
  const { emailOrUsername, password } = req.body;
  const email = req.body.email; // retrocompatibilidad

  const loginValue = (emailOrUsername || email || '').trim();
  if (loginValue === '' || password === '') {
    res.status(400).json({ message: 'Proporciona email o nombre de usuario y contraseña.' });
    return;
  }

  const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(loginValue);
  const query = isEmail
    ? { email: loginValue.toLowerCase() }
    : { username: loginValue.toLowerCase() };

  User.findOne(query)
    .then((foundUser) => {
      if (!foundUser) {
        res.status(401).json({ message: 'Usuario no encontrado.' });
        return;
      }
      const passwordCorrect = bcrypt.compareSync(password, foundUser.password);
      if (passwordCorrect) {
        const { _id, email: e, username: u, firstName, lastName, isAdmin } = foundUser;
        const payload = { _id, email: e, username: u, firstName, lastName, isAdmin };
        const tokenSecret = process.env.TOKEN_SECRET || process.env.JWT_SECRET;
        const authToken = jwt.sign(payload, tokenSecret, {
          algorithm: 'HS256',
          expiresIn: '365d',
        });
        res.status(200).json({ authToken });
      } else {
        res.status(401).json({ message: 'Contraseña incorrecta.' });
      }
    })
    .catch((err) => next(err));
});

// GET /auth/verify
router.get('/verify', isAuthenticated, (req, res, next) => {
  res.status(200).json(req.payload);
});

// PUT /auth/profile - actualizar perfil (username, firstName, lastName)
router.put('/profile', isAuthenticated, (req, res, next) => {
  const userId = req.payload._id;
  const { username, firstName, lastName } = req.body;

  const updates = {};
  if (firstName !== undefined) updates.firstName = firstName.trim();
  if (lastName !== undefined) updates.lastName = lastName.trim();
  if (username !== undefined) {
    const usernameTrimmed = username.trim();
    if (usernameTrimmed === '') {
      updates.username = null;
    } else {
      if (usernameTrimmed.length < 3) {
        res.status(400).json({ message: 'El nombre de usuario debe tener al menos 3 caracteres.' });
        return;
      }
      updates.username = usernameTrimmed.toLowerCase();
    }
  }

  if (Object.keys(updates).length === 0) {
    res.status(400).json({ message: 'No hay datos para actualizar.' });
    return;
  }

  const checkUsername = () => {
    if (updates.username == null || updates.username === '') return Promise.resolve(false);
    return User.findOne({ username: updates.username, _id: { $ne: userId } }).then((u) => !!u);
  };

  checkUsername()
    .then((usernameTaken) => {
      if (usernameTaken) {
        res.status(400).json({ message: 'Ya existe otro usuario con ese nombre de usuario.' });
        return null;
      }
      return User.findByIdAndUpdate(userId, updates, { new: true });
    })
    .then((updatedUser) => {
      if (!updatedUser) return;
      const { _id, email, username: u, firstName, lastName, isAdmin } = updatedUser;
      const payload = { _id, email, username: u, firstName, lastName, isAdmin };
      const tokenSecret = process.env.TOKEN_SECRET || process.env.JWT_SECRET;
      const authToken = jwt.sign(payload, tokenSecret, {
        algorithm: 'HS256',
        expiresIn: '365d',
      });
      res.status(200).json({ user: payload, authToken });
    })
    .catch((err) => next(err));
});

module.exports = router;
