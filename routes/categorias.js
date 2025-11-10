const express = require('express');
const router = express.Router();
const {
  listarCategorias,
  crearCategoria,
  actualizarCategoria,
  eliminarCategoria,
} = require('../controllers/categorias');

// Rutas públicas
router.get('/', listarCategorias);

// Rutas protegidas
router.post('/', crearCategoria);
router.put('/:id', actualizarCategoria);
router.delete('/:id', eliminarCategoria);

module.exports = router;
