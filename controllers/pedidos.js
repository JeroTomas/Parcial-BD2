const Pedido = require('../models/Pedido');

// Listar pedidos
exports.listarPedidos = async (req, res) => {
  try {
    const pedidos = await Pedido.find().populate('usuario', 'nombre').populate('items.producto', 'nombre precio');
    res.json({ success: true, data: pedidos });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Crear pedido
exports.crearPedido = async (req, res) => {
  try {
    const pedido = new Pedido(req.body);
    await pedido.save();
    res.status(201).json({ success: true, data: pedido });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// Actualizar pedido
exports.actualizarPedido = async (req, res) => {
  try {
    const pedido = await Pedido.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!pedido) {
      return res.status(404).json({ success: false, error: 'Pedido no encontrado' });
    }
    res.json({ success: true, data: pedido });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Eliminar pedido
exports.eliminarPedido = async (req, res) => {
  try {
    const pedido = await Pedido.findByIdAndDelete(req.params.id);
    if (!pedido) {
      return res.status(404).json({ success: false, error: 'Pedido no encontrado' });
    }
    res.json({ success: true, message: 'Pedido eliminado' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
