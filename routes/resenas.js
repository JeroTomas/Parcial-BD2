const express = require('express');
const router = express.Router();
const {
  listarResenas,
  crearResena,
  actualizarResena,
  eliminarResena,
} = require('../controllers/resenas');

// Rutas públicas
router.get('/', listarResenas);

// Rutas protegidas
router.post('/', crearResena);
router.put('/:id', actualizarResena);
router.delete('/:id', eliminarResena);

module.exports = router;
