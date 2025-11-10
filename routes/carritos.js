const express = require('express');
const router = express.Router();
const {
  listarCarritos,
  crearCarrito,
  actualizarCarrito,
  eliminarCarrito,
} = require('../controllers/carritos');

// Rutas protegidas
router.get('/', listarCarritos);
router.post('/', crearCarrito);
router.put('/:id', actualizarCarrito);
router.delete('/:id', eliminarCarrito);

module.exports = router;
