const mongoose = require('mongoose');

const carritoSchema = new mongoose.Schema({
  usuario: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true },
  items: [
    {
      producto: { type: mongoose.Schema.Types.ObjectId, ref: 'Producto', required: true },
      cantidad: { type: Number, required: true, min: 1 },
    },
  ],
});

module.exports = mongoose.model('Carrito', carritoSchema);
