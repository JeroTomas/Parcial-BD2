const express = require('express');
const router = express.Router();
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

router.get('/', listarUsuarios);
router.get('/:id', detalleUsuario);
router.put('/:id', actualizarUsuario);
router.delete('/:id', eliminarUsuario);



module.exports = router;
