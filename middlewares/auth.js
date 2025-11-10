const jwt = require('jsonwebtoken');

// Middleware para verificar token
exports.verificarToken = (req, res, next) => {
  const token = req.header('x-auth-token');
  if (!token) {
    return res.status(401).json({ success: false, error: 'Acceso denegado. No se proporcionó token.' });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.usuario = decoded;
    next();
  } catch (err) {
    res.status(400).json({ success: false, error: 'Token inválido.' });
  }
};

// Middleware para verificar rol de admin
exports.verificarAdmin = (req, res, next) => {
  if (req.usuario.rol !== 'admin') {
    return res.status(403).json({ success: false, error: 'Acceso denegado. Se requiere rol de admin.' });
  }
  next();
};
