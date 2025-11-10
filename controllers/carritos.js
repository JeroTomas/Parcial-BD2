const Carrito = require('../models/Carrito');

// Listar carritos
exports.listarCarritos = async (req, res) => {
  try {
    const carritos = await Carrito.find().populate('usuario', 'nombre').populate('items.producto', 'nombre precio');
    res.json({ success: true, data: carritos });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Crear carrito
exports.crearCarrito = async (req, res) => {
  try {
    const carrito = new Carrito(req.body);
    await carrito.save();
    res.status(201).json({ success: true, data: carrito });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// Actualizar carrito
exports.actualizarCarrito = async (req, res) => {
  try {
    const carrito = await Carrito.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!carrito) {
      return res.status(404).json({ success: false, error: 'Carrito no encontrado' });
    }
    res.json({ success: true, data: carrito });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Eliminar carrito
exports.eliminarCarrito = async (req, res) => {
  try {
    const carrito = await Carrito.findByIdAndDelete(req.params.id);
    if (!carrito) {
      return res.status(404).json({ success: false, error: 'Carrito no encontrado' });
    }
    res.json({ success: true, message: 'Carrito eliminado' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
