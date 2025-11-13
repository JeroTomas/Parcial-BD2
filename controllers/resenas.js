const Resena = require('../models/Resena');
const Pedido = require('../models/Pedido');
const Producto = require('../models/Producto');

// Hacer una reseña
const crearResena = async (req, res) => {
  try {
    const usuarioId = req.usuario.id;
    const { producto: productoId, comentario, calificacion } = req.body;
    if (!productoId || !calificacion) return res.status(400).json({ success:false, error: 'producto y calificacion obligatorios' });
    // Verifica la compra: busca pedidos del usuario que incluyan ese producto
    const comprado = await Pedido.findOne({ usuario: usuarioId, 'items.producto': productoId });
    if (!comprado) return res.status(403).json({ success:false, error: 'Solo se puede reseñar productos comprados' });
    // Una reseña por usuario/producto
    const existing = await Resena.findOne({ usuario: usuarioId, producto: productoId });
    if (existing) return res.status(400).json({ success:false, error: 'Ya realizaste una reseña para este producto' });
    // Crea la reseña
    const resena = new Resena({ usuario: usuarioId, producto: productoId, comentario, calificacion });
    await resena.save();

    // Actualiza avgRating y reviewsCount en el producto
    const agg = await Resena.aggregate([
      { $match: { producto: productoId } },
      { $group: { _id: '$producto', avgRating: { $avg: '$calificacion' }, count: { $sum: 1 } } }
    ]);
    if (agg.length) {
      await Producto.findByIdAndUpdate(productoId, { $set: { avgRating: agg[0].avgRating, reviewsCount: agg[0].count } });
    }

    res.status(201).json({ success:true, data: resena });
  } catch (err) {
    if (err.code === 11000) return res.status(400).json({ success:false, error: 'Ya existe reseña' });
    res.status(500).json({ success:false, error: err.message });
  }
};

// Editar reseña (solo el autor)
const actualizarResena = async (req, res) => {
  try {
    // Actualiza el comentario y/o la reseña
    const usuarioId = req.usuario.id;
    const resena = await Resena.findById(req.params.id);
    if (!resena) return res.status(404).json({ success:false, error: 'Reseña no encontrada' });
    if (resena.usuario.toString() !== usuarioId) return res.status(403).json({ success:false, error: 'Solo el autor puede editar' });
    const { comentario, calificacion } = req.body;
    if (comentario) resena.comentario = comentario;
    if (calificacion) resena.calificacion = calificacion;
    await resena.save();
    // Actualiza avgRating
    const agg = await Resena.aggregate([
      { $match: { producto: resena.producto } },
      { $group: { _id: '$producto', avgRating: { $avg: '$calificacion' }, count: { $sum: 1 } } }
    ]);
    if (agg.length) {
      await Producto.findByIdAndUpdate(resena.producto, { $set: { avgRating: agg[0].avgRating, reviewsCount: agg[0].count } });
    }
    res.json({ success:true, data: resena });
  } catch (err) { res.status(500).json({ success:false, error: err.message }); }
};

// Muestra todas las reseñas
const listarResenas = async (req, res) => {
  try {
    const resenas = await Resena.find().populate('usuario','nombre').populate('producto','nombre');
    res.json({ success:true, data: resenas });
  } catch (err) { res.status(500).json({ success:false, error: err.message }); }
};

// Muestra todas las reseñas de un producto
const listarResenasPorProducto = async (req, res) => {
  try {
    const productoId = req.params.productoId;
    const resenas = await Resena.find({ producto: productoId }).populate('usuario','nombre');
    res.json({ success:true, data: resenas });
  } catch (err) { res.status(500).json({ success:false, error: err.message }); }
};

// Top 10 mejores productos
const listarTopProductos = async (req, res) => {
  try {
    // productos mejor calificados por avgRating
    const productos = await Producto.find().sort({ avgRating: -1 }).limit(10).populate('categoria','nombre');
    res.json({ success:true, data: productos });
  } catch (err) { res.status(500).json({ success:false, error: err.message }); }
};

module.exports = { crearResena, actualizarResena, listarResenas, listarResenasPorProducto, listarTopProductos };
