const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/productos');
const { verificarToken, verificarAdmin } = require('../middlewares/auth');

router.get('/', ctrl.listarProductos);
router.get('/:id', ctrl.detalleProducto);
// Solo admin
router.post('/', verificarToken, verificarAdmin, ctrl.crearProducto);
router.put('/:id', verificarToken, verificarAdmin, ctrl.actualizarProducto);
router.delete('/:id', verificarToken, verificarAdmin, ctrl.eliminarProducto);

module.exports = router;
