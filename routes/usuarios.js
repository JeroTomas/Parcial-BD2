const express = require('express');
const router = express.Router();
const { verificarToken, verificarAdmin } = require('../middlewares/auth');
const {
  registrarUsuario,
  loginUsuario,
  listarUsuarios,
  detalleUsuario,
  actualizarUsuario,
  eliminarUsuario,
} = require('../controllers/usuarios');

// Rutas públicas
router.post('/register', registrarUsuario);
router.post('/login', loginUsuario);

// Rutas protegidas
router.get('/', verificarToken, verificarAdmin, listarUsuarios);
router.get('/:id', verificarToken, verificarAdmin, detalleUsuario);
router.put('/:id', verificarToken, actualizarUsuario);
router.delete('/:id', verificarToken, eliminarUsuario);

module.exports = router;
