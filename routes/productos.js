const express = require('express');
const router = express.Router();
const {
  listarProductos,
  detalleProducto,
  crearProducto,
  actualizarProducto,
  eliminarProducto,
} = require('../controllers/productos');

// Rutas públicas
router.get('/', listarProductos);
router.get('/:id', detalleProducto);

// Rutas protegidas
router.post('/', crearProducto);
router.put('/:id', actualizarProducto);
router.delete('/:id', eliminarProducto);

module.exports = router;
