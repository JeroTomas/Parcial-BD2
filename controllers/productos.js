const Producto = require('../models/Producto');

// Listar productos
exports.listarProductos = async (req, res) => {
  try {
    const productos = await Producto.find().populate('categoria', 'nombre');
    res.json({ success: true, data: productos });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Detalle de producto
exports.detalleProducto = async (req, res) => {
  try {
    const producto = await Producto.findById(req.params.id).populate('categoria', 'nombre');
    if (!producto) {
      return res.status(404).json({ success: false, error: 'Producto no encontrado' });
    }
    res.json({ success: true, data: producto });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Crear producto
exports.crearProducto = async (req, res) => {
  try {
    const producto = new Producto(req.body);
    await producto.save();
    res.status(201).json({ success: true, data: producto });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// Actualizar producto
exports.actualizarProducto = async (req, res) => {
  try {
    const producto = await Producto.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!producto) {
      return res.status(404).json({ success: false, error: 'Producto no encontrado' });
    }
    res.json({ success: true, data: producto });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Eliminar producto
exports.eliminarProducto = async (req, res) => {
  try {
    const producto = await Producto.findByIdAndDelete(req.params.id);
    if (!producto) {
      return res.status(404).json({ success: false, error: 'Producto no encontrado' });
    }
    res.json({ success: true, message: 'Producto eliminado' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
