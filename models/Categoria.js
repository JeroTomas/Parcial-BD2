// models/Categoria.js
const mongoose = require('mongoose');

const categoriaSchema = new mongoose.Schema({
  nombre: { type: String, required: true, unique: true },
  descripcion: { type: String }
});

module.exports = mongoose.model('Categoria', categoriaSchema);
