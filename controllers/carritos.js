const Carrito = require('../models/Carrito');
const Producto = require('../models/Producto');
const mongoose = require('mongoose');

// Funcion auxiliar que devuelve el precio total
const calcularTotal = async (items) => {
  let total = 0;
  for (const it of items) {
    const prod = await Producto.findById(it.producto);
    if (!prod) throw new Error('Producto no encontrado: ' + it.producto);
    total += prod.precio * it.cantidad;
  }
  return total;
};

// Listar carrito
const listarCarritos = async (req, res) => {
  try {
    // Lista todos los carritos existentes (solo admin)
    if (req.usuario.rol === 'admin') {
      const carritos = await Carrito.find().populate('usuario','nombre email').populate('items.producto','nombre precio');
      return res.json({ success:true, data: carritos });
    }
    // Muestra el carrito del usuario
    const carrito = await Carrito.findOne({ usuario: req.usuario.id }).populate('items.producto','nombre precio');
    if (!carrito) return res.status(404).json({ success:false, error: 'Carrito no encontrado' });
    // Calcular subtotal/total en respuesta
    let subtotal = 0;
    carrito.items.forEach(i => subtotal += (i.producto.precio * i.cantidad));
    res.json({ success:true, data: { carrito, subtotal, total: subtotal } });
  } catch (err) { res.status(500).json({ success:false, error: err.message }); }
};

// Evita crear carritos manualmente
const crearCarrito = async (req, res) => {
  res.status(400).json({ success:false, error: 'Los carritos se crean automáticamente al registrarse' });
};

// Actualiza el carrito
const actualizarCarrito = async (req, res) => {
  try {
    const usuarioId = req.usuario.id;
    const { productoId, cantidad, accion } = req.body;
    if (!productoId || cantidad == null || !['add','remove','set'].includes(accion)) {
      return res.status(400).json({ success:false, error: 'productoId, cantidad y accion obligatorios' });
    }
    const carrito = await Carrito.findOne({ usuario: usuarioId });
    if (!carrito) return res.status(404).json({ success:false, error: 'Carrito no encontrado' });
    // Busca el item y realiza la acción
    const index = carrito.items.findIndex(i => i.producto.toString() === productoId);
    if (accion === 'add') {
      if (index >=0) carrito.items[index].cantidad += Number(cantidad);
      else carrito.items.push({ producto: productoId, cantidad: Number(cantidad) });
    } else if (accion === 'remove') {
      if (index >=0) carrito.items.splice(index, 1);
      else return res.status(400).json({ success:false, error: 'Producto no en carrito' });
    } else if (accion === 'set') {
      if (index >=0) carrito.items[index].cantidad = Number(cantidad);
      else carrito.items.push({ producto: productoId, cantidad: Number(cantidad) });
    }
    // Recalcula el total
    const populated = await carrito.populate('items.producto','precio nombre');
    let total = 0;
    populated.items.forEach(it => total += it.producto.precio * it.cantidad);
    carrito.total = total;
    await carrito.save();
    res.json({ success:true, data: carrito });
  } catch (err) { res.status(500).json({ success:false, error: err.message }); }
};

// Elimina el producto
const eliminarProductoCarrito = async (req, res) => {
  try {
    const usuarioId = req.usuario.id;
    const productoId = req.params.productoId;
    const carrito = await Carrito.findOne({ usuario: usuarioId });
    if (!carrito) return res.status(404).json({ success:false, error: 'Carrito no encontrado' });
    carrito.items = carrito.items.filter(i => i.producto.toString() !== productoId);
    await carrito.save();
    res.json({ success:true, message: 'Producto eliminado del carrito' });
  } catch (err) { res.status(500).json({ success:false, error: err.message }); }
};

module.exports = { listarCarritos, crearCarrito, actualizarCarrito, eliminarProductoCarrito };
