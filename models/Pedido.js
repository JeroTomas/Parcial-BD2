const mongoose = require('mongoose');

// Precio subtotal del producto
const pedidoItemSchema = new mongoose.Schema({
  producto: { type: mongoose.Schema.Types.ObjectId, ref: 'Producto', required: true },
  cantidad: { type: Number, required: true },
  subtotal: { type: Number, required: true } // precioUnitario * cantidad guardado
});

// Detllaes del pedido
const pedidoSchema = new mongoose.Schema({
  usuario: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true },
  items: [pedidoItemSchema],
  total: { type: Number, required: true },
  estado: { type: String, enum: ['pendiente','enviado','entregado','cancelado'], default: 'pendiente' },
  metodoPago: { type: String, enum: ['tranferencia', 'efectivo', 'tarjeta'], required: true },
  fecha: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Pedido', pedidoSchema);
