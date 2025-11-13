const jwt = require('jsonwebtoken');

// Crea un token JWT que contiene los datos del usuario
const generarToken = (usuario) => {
  return jwt.sign({ id: usuario._id.toString(), rol: usuario.rol }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '1d'
  });
};

// Busca el token en el header HTTP de la petición
const extraerTokenDesdeHeader = (req) => {
  const header = req.header('x-auth-token') || req.header('authorization');
  if (!header) return null;
  return header.startsWith('Bearer ') ? header.split(' ')[1] : header; // Devuelve el token limpio
};

// Verifica si el token es válido
const verificarToken = (req, res, next) => {
  const token = extraerTokenDesdeHeader(req);
  if (!token) return res.status(401).json({ success: false, error: 'Acceso denegado. No token.' }); // Si no hay token
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.usuario = decoded; // { id, rol }
    return next();
  } catch (err) {
    return res.status(401).json({ success: false, error: 'Token inválido o expirado' }); // Si ya expiro el token
  }
};

// Verifica que el usuario sea admin
const verificarAdmin = (req, res, next) => {
  if (!req.usuario) return res.status(401).json({ success: false, error: 'Autenticación requerida' });
  if (req.usuario.rol !== 'admin') return res.status(403).json({ success: false, error: 'Acceso denegado. Requiere rol admin' });
  next();
};

module.exports = { generarToken, verificarToken, verificarAdmin };
