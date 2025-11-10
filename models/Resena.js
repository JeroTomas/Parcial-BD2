const mongoose = require('mongoose');

const resenaSchema = new mongoose.Schema({
  usuario: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true },
  producto: { type: mongoose.Schema.Types.ObjectId, ref: 'Producto', required: true },
  calificacion: { type: Number, required: true, min: 1, max: 5 },
  comentario: { type: String },
  fecha: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Resena', resenaSchema);
