const Categoria = require('../models/Categoria');
const Producto = require('../models/Producto');

// Crea una categoria (solo admin)
const crearCategoria = async (req, res) => {
  try {
    const { nombre, descripcion } = req.body;
    if (!nombre) return res.status(400).json({ success:false, error: 'Nombre obligatorio' });
    const exists = await Categoria.findOne({ nombre });
    if (exists) return res.status(400).json({ success:false, error: 'Categoría ya existe' });
    const cat = new Categoria({ nombre, descripcion });
    await cat.save();
    res.status(201).json({ success:true, data: cat });
  } catch (err) { res.status(500).json({ success:false, error: err.message }); }
};

// Lista todas las categorias
const listarCategorias = async (req, res) => {
  try {
    // Cantidad de productos por categoria
    const pipeline = [
      { $lookup: { from: 'productos', localField: '_id', foreignField: 'categoria', as: 'productos' } },
      { $project: { nombre: 1, descripcion: 1, cantidad: { $size: '$productos' } } }
    ];
    const categorias = await Categoria.aggregate(pipeline);
    res.json({ success:true, data: categorias });
  } catch (err) { res.status(500).json({ success:false, error: err.message }); }
};

// Actualiza la categoria (solo admin)
const actualizarCategoria = async (req, res) => {
  try {
    const cat = await Categoria.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!cat) return res.status(404).json({ success:false, error: 'Categoría no encontrada' });
    res.json({ success:true, data: cat });
  } catch (err) { res.status(500).json({ success:false, error: err.message }); }
};

// Elimina la categoria (solo admin)
const eliminarCategoria = async (req, res) => {
  try {
    const cat = await Categoria.findByIdAndDelete(req.params.id);
    if (!cat) return res.status(404).json({ success:false, error: 'Categoría no encontrada' });
    res.json({ success:true, message: 'Categoría eliminada' });
  } catch (err) { res.status(500).json({ success:false, error: err.message }); }
};

module.exports = { crearCategoria, listarCategorias, actualizarCategoria, eliminarCategoria };
