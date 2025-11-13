const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/resenas');
const { verificarToken } = require('../middlewares/auth');

router.get('/', ctrl.listarResenas);
router.get('/producto/:productoId', ctrl.listarResenasPorProducto);
router.get('/top', ctrl.listarTopProductos);
router.post('/', verificarToken, ctrl.crearResena); // Solo usuarios autenticados que compraron
router.put('/:id', verificarToken, ctrl.actualizarResena); // Solo autor

module.exports = router;
