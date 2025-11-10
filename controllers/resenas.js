const Resena = require('../models/Resena');

// Listar reseñas
exports.listarResenas = async (req, res) => {
  try {
    const resenas = await Resena.find().populate('usuario', 'nombre').populate('producto', 'nombre');
    res.json({ success: true, data: resenas });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Crear reseña
exports.crearResena = async (req, res) => {
  try {
    const resena = new Resena(req.body);
    await resena.save();
    res.status(201).json({ success: true, data: resena });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// Actualizar reseña
exports.actualizarResena = async (req, res) => {
  try {
    const resena = await Resena.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!resena) {
      return res.status(404).json({ success: false, error: 'Reseña no encontrada' });
    }
    res.json({ success: true, data: resena });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Eliminar reseña
exports.eliminarResena = async (req, res) => {
  try {
    const resena = await Resena.findByIdAndDelete(req.params.id);
    if (!resena) {
      return res.status(404).json({ success: false, error: 'Reseña no encontrada' });
    }
    res.json({ success: true, message: 'Reseña eliminada' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
