const Pedido = require('../models/Pedido');
const Carrito = require('../models/Carrito');
const Producto = require('../models/Producto');
const mongoose = require('mongoose');

// Realizar pedido
const crearPedido = async (req, res) => {
  try {
    const usuarioId = req.usuario.id;
    const { metodoPago } = req.body; // Verifica cual es el metodo de pago

    // Obtiene el carrito del usuario
    const carrito = await Carrito.findOne({ usuario: usuarioId }).populate('items.producto','precio stock nombre');
    if (!carrito || carrito.items.length === 0) return res.status(400).json({ success:false, error: 'Carrito vacío' });

    // Valida el stock y arma items del pedido
    const itemsPedido = [];
    let total = 0;
    for (const it of carrito.items) {
      if (it.producto.stock < it.cantidad) return res.status(400).json({ success:false, error: `Stock insuficiente para ${it.producto.nombre}` });
      const subtotal = it.producto.precio * it.cantidad;
      itemsPedido.push({ producto: it.producto._id, cantidad: it.cantidad, subtotal });
      total += subtotal;
    }

    // Crea el pedido y decrementa stock (sin transacciones si no replica set — simple)
    const pedido = new Pedido({ usuario: usuarioId, items: itemsPedido, total, metodoPago });
    await pedido.save();

    // Decrementa el stock
    for (const it of carrito.items) {
      await Producto.findByIdAndUpdate(it.producto._id, { $inc: { stock: -it.cantidad } });
    }

    // Vacia el carrito
    carrito.items = [];
    carrito.total = 0;
    await carrito.save();

    res.status(201).json({ success:true, data: pedido });
  } catch (err) { res.status(500).json({ success:false, error: err.message }); }
};

// Muestra detalles del pedido
const listarPedidosUsuario = async (req, res) => {
  try {
    const userId = req.params.userId;
    if (req.usuario.id !== userId && req.usuario.rol !== 'admin') return res.status(403).json({ success:false, error: 'No autorizado' });
    const pedidos = await Pedido.find({ usuario: userId }).populate('items.producto','nombre precio');
    res.json({ success:true, data: pedidos });
  } catch (err) { res.status(500).json({ success:false, error: err.message }); }
};

// Lista todos los pedidos (solo admin)
const listarTodosPedidos = async (req, res) => {
  try {
    const pedidos = await Pedido.find().populate('usuario','nombre email').populate('items.producto','nombre');
    res.json({ success:true, data: pedidos });
  } catch (err) { res.status(500).json({ success:false, error: err.message }); }
};

// Lista los pedidos por su estado
const pedidosStatsPorEstado = async (req, res) => {
  try {
    const pipeline = [
      { $group: { _id: '$estado', total: { $sum: 1 } } },
      { $sort: { total: -1 } }
    ];
    const stats = await Pedido.aggregate(pipeline);
    res.json({ success:true, data: stats });
  } catch (err) { res.status(500).json({ success:false, error: err.message }); }
};

// Cambia el estado de un pedido (solo admin)
const actualizarEstadoPedido = async (req, res) => {
  try {
    const pedido = await Pedido.findByIdAndUpdate(req.params.id, { estado: req.body.estado }, { new: true });
    if (!pedido) return res.status(404).json({ success:false, error: 'Pedido no encontrado' });
    res.json({ success:true, data: pedido });
  } catch (err) { res.status(500).json({ success:false, error: err.message }); }
};

module.exports = { crearPedido, listarPedidosUsuario, listarTodosPedidos, pedidosStatsPorEstado, actualizarEstadoPedido };
