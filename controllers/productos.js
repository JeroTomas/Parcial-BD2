const Producto = require('../models/Producto');
const Resena = require('../models/Resena');
const mongoose = require('mongoose');

// Crea un producto (solo admin)
const crearProducto = async (req, res) => {
  try {
    const { nombre, marca, descripcion, categoria, precio, stock } = req.body;
    if (!nombre || !categoria || precio == null || stock == null) return res.status(400).json({ success:false, error: 'Faltan campos obligatorios' });
    const producto = new Producto({ nombre, marca, descripcion, categoria, precio, stock });
    await producto.save();
    // creamos campos iniciales de reseña (avgRating y reviewsCount ya vienen en modelo)
    res.status(201).json({ success:true, data: producto });
  } catch (err) { res.status(500).json({ success:false, error: err.message }); }
};

// Filtrar las categorias
const listarProductos = async (req, res) => {
  try {
    // Opciones para filtrar por categoria, marca, rango de precio y ordenar por rating
    const { categoria, marca, minPrecio, maxPrecio, top } = req.query;
    const match = {};
    if (categoria) match.categoria = mongoose.Types.ObjectId(categoria);
    if (marca) match.marca = marca;
    if (minPrecio || maxPrecio) {
      match.precio = {};
      if (minPrecio) match.precio.$gte = Number(minPrecio);
      if (maxPrecio) match.precio.$lte = Number(maxPrecio);
    }
    const pipeline = [
      { $match: match },
      { $lookup: { from: 'categorias', localField: 'categoria', foreignField: '_id', as: 'categoria' } },
      { $unwind: '$categoria' },
      { $project: { nombre:1, marca:1, descripcion:1, precio:1, stock:1, 'categoria.nombre':1, avgRating:1, reviewsCount:1 } }
    ];
    if (top === 'true') pipeline.push({ $sort: { avgRating: -1 } });
    const productos = await Producto.aggregate(pipeline);
    res.json({ success:true, data: productos });
  } catch (err) { res.status(500).json({ success:false, error: err.message }); }
};

// Detalles del producto
const detalleProducto = async (req, res) => {
  try {
    const producto = await Producto.findById(req.params.id).populate('categoria', 'nombre descripcion');
    if (!producto) return res.status(404).json({ success:false, error: 'Producto no encontrado' });
    // Trae las reseñas
    const reseñas = await Resena.find({ producto: producto._id }).populate('usuario', 'nombre');
    res.json({ success:true, data: { producto, reseñas } });
  } catch (err) { res.status(500).json({ success:false, error: err.message }); }
};

// Actualiza precio/stock/descripcion del producto (solo admin)
const actualizarProducto = async (req, res) => {
  try {
    const updated = await Producto.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ success:false, error: 'Producto no encontrado' });
    res.json({ success:true, data: updated });
  } catch (err) { res.status(500).json({ success:false, error: err.message }); }
};

// Elimina el producto (solo admin)
const eliminarProducto = async (req, res) => {
  try {
    const prod = await Producto.findByIdAndDelete(req.params.id);
    if (!prod) return res.status(404).json({ success:false, error: 'Producto no encontrado' });
    await Resena.deleteMany({ producto: prod._id });
    res.json({ success:true, message: 'Producto y reseñas asociadas eliminadas' });
  } catch (err) { res.status(500).json({ success:false, error: err.message }); }
};

module.exports = { crearProducto, listarProductos, detalleProducto, actualizarProducto, eliminarProducto };
