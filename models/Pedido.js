const mongoose = require('mongoose');

const pedidoSchema = new mongoose.Schema({
  usuario: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true },
  items: [
    {
      producto: { type: mongoose.Schema.Types.ObjectId, ref: 'Producto', required: true },
      cantidad: { type: Number, required: true },
      precioUnitario: { type: Number, required: true },
    },
  ],
  total: { type: Number, required: true },
  estado: { type: String, enum: ['pendiente', 'enviado', 'entregado'], default: 'pendiente' },
  metodoPago: { type: String, required: true },
  fecha: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Pedido', pedidoSchema);
