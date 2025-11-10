const Categoria = require('../models/Categoria');

// Listar categorías
exports.listarCategorias = async (req, res) => {
  try {
    const categorias = await Categoria.find();
    res.json({ success: true, data: categorias });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Crear categoría
exports.crearCategoria = async (req, res) => {
  try {
    const categoria = new Categoria(req.body);
    await categoria.save();
    res.status(201).json({ success: true, data: categoria });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// Actualizar categoría
exports.actualizarCategoria = async (req, res) => {
  try {
    const categoria = await Categoria.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!categoria) {
      return res.status(404).json({ success: false, error: 'Categoría no encontrada' });
    }
    res.json({ success: true, data: categoria });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Eliminar categoría
exports.eliminarCategoria = async (req, res) => {
  try {
    const categoria = await Categoria.findByIdAndDelete(req.params.id);
    if (!categoria) {
      return res.status(404).json({ success: false, error: 'Categoría no encontrada' });
    }
    res.json({ success: true, message: 'Categoría eliminada' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
