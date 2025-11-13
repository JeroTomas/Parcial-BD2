const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/pedidos');
const { verificarToken, verificarAdmin } = require('../middlewares/auth');

router.post('/', verificarToken, ctrl.crearPedido); // Todos los usuarios pueden crear un pedido desde su carrito
router.get('/user/:userId', verificarToken, ctrl.listarPedidosUsuario); // Dueño o admin
// Solo admin
router.get('/', verificarToken, verificarAdmin, ctrl.listarTodosPedidos);
router.get('/stats/estado', verificarToken, verificarAdmin, ctrl.pedidosStatsPorEstado);
router.put('/:id/estado', verificarToken, verificarAdmin, ctrl.actualizarEstadoPedido);

module.exports = router;
