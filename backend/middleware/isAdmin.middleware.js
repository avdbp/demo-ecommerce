const isAdmin = (req, res, next) => {
  if (req.payload && req.payload.isAdmin) {
    next();
  } else {
    const error = new Error('Acceso no autorizado');
    res.status(403);
    next(error);
  }
};

module.exports = { isAdmin };
