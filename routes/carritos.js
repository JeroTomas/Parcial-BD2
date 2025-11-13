const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/carritos');
const { verificarToken, verificarAdmin } = require('../middlewares/auth');

// Todos los usuarios registrados
router.get('/', verificarToken, ctrl.listarCarritos);
router.post('/', ctrl.crearCarrito); // no usar: se crea al registrarse
router.put('/', verificarToken, ctrl.actualizarCarrito); // body contiene productoId, cantidad, accion
router.delete('/:productoId', verificarToken, ctrl.eliminarProductoCarrito); // elimina el producto del carrito

module.exports = router;
