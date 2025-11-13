const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/categorias');
const { verificarToken, verificarAdmin } = require('../middlewares/auth');

router.get('/', ctrl.listarCategorias);
// Solo admin
router.post('/', verificarToken, verificarAdmin, ctrl.crearCategoria);
router.put('/:id', verificarToken, verificarAdmin, ctrl.actualizarCategoria);
router.delete('/:id', verificarToken, verificarAdmin, ctrl.eliminarCategoria);

module.exports = router;
