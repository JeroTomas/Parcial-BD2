const mongoose = require('mongoose');
// Cantidad de veces que seguarda el producto
const itemSchema = new mongoose.Schema({
  producto: { type: mongoose.Schema.Types.ObjectId, ref: 'Producto', required: true },
  cantidad: { type: Number, required: true, min: 1 }
});

// Verificacion del carrito y lista de productos en el carrito
const carritoSchema = new mongoose.Schema({
  usuario: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', unique: true, required: true },
  items: [itemSchema],
  total: { type: Number, default: 0 } // se calcula al leer
});

module.exports = mongoose.model('Carrito', carritoSchema);
