const express = require('express');
const router = express.Router();
const { verificarToken } = require('../middlewares/auth');
const {
  registrarUsuario,
  loginUsuario,
  listarUsuarios,
  detalleUsuario,
  actualizarUsuario,
  eliminarUsuario,
  cambiarPassword
} = require('../controllers/usuarios');

// Rutas públicas
router.post('/register', registrarUsuario);
router.post('/login', loginUsuario);

// Rutas protegidas
router.get('/', verificarToken, listarUsuarios);
router.get('/:id', verificarToken, detalleUsuario);
router.put('/:id', verificarToken, actualizarUsuario);
router.put('/:id/password', verificarToken, cambiarPassword);
router.delete('/:id', verificarToken, eliminarUsuario);

module.exports = router;
