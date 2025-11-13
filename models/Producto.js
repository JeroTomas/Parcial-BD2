const mongoose = require('mongoose');

const productoSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  marca: { type: String },
  descripcion: { type: String },
  categoria: { type: mongoose.Schema.Types.ObjectId, ref: 'Categoria', required: true },
  precio: { type: Number, required: true },
  stock: { type: Number, required: true, default: 0 },
  createdAt: { type: Date, default: Date.now },
  // campos agregados para reseñas
  avgRating: { type: Number, default: null }, // promedio 1-10
  reviewsCount: { type: Number, default: 0 }
});

module.exports = mongoose.model('Producto', productoSchema);
