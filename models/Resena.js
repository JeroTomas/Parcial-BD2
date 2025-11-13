const mongoose = require('mongoose');

// Detalles de la reseña
const resenaSchema = new mongoose.Schema({
  usuario: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true },
  producto: { type: mongoose.Schema.Types.ObjectId, ref: 'Producto', required: true },
  comentario: { type: String },
  calificacion: { type: Number, required: true, min: 1, max: 10 },
  fecha: { type: Date, default: Date.now }
});

// Una reseña por usuario/producto
resenaSchema.index({ usuario: 1, producto: 1 }, { unique: true }); 

module.exports = mongoose.model('Resena', resenaSchema);
