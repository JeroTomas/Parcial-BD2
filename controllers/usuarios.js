const Usuario = require('../models/Usuario');
const Carrito = require('../models/Carrito');
const { generarToken } = require('../middlewares/auth');
const { validationResult } = require('express-validator');

const registrarUsuario = async (req, res) => {
  try {
    // Validaciones expresadas en ruta con express-validator
    const errs = validationResult(req);
    if (!errs.isEmpty()) return res.status(400).json({ success:false, error: errs.array() });

    const { nombre, email, password, telefono, rol, adminCode } = req.body;

    // Evitar creación de admin sin el master code
    let roleToSet = 'cliente';
    if (rol === 'admin') {
      if (adminCode !== process.env.MASTER_ADMIN_CODE) {
        return res.status(403).json({ success:false, error: 'Código admin inválido' });
      }
      roleToSet = 'admin';
    }

    // Evitar duplicados
    const existing = await Usuario.findOne({ email });
    if (existing) return res.status(400).json({ success:false, error: 'Email ya registrado' });

    const usuario = new Usuario({ nombre, email, password, telefono, rol: roleToSet });
    await usuario.save();

    // Crea un carrito asociado por id
    const carrito = new Carrito({ usuario: usuario._id, items: [], total: 0 });
    await carrito.save();

    res.status(201).json({ success:true, data: { id: usuario._id, nombre: usuario.nombre, email: usuario.email, rol: usuario.rol } });
  } catch (err) {
    res.status(500).json({ success:false, error: err.message });
  }
};

// Login del usuario
const loginUsuario = async (req, res) => {
  try {
    // Verifica que el usuario exista
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ success:false, error: 'Faltan Credenciales' });

    const usuario = await Usuario.findOne({ email });
    if (!usuario) return res.status(401).json({ success:false, error: 'Credenciales inválidas' });
    // Verifica la contraseña
    const ok = await usuario.compararPassword(password);
    if (!ok) return res.status(401).json({ success:false, error: 'Credenciales inválidas' });
    // Crea el token y lo devuelve
    const token = generarToken(usuario);
    res.json({ success:true, token });
  } catch (err) {
    res.status(500).json({ success:false, error: err.message });
  }
};

// Lista los usuarios sin las contraseñas (solo admin)
const listarUsuarios = async (req, res) => {
  try {
    const usuarios = await Usuario.find().select('-password');
    res.json({ success:true, data: usuarios });
  } catch (err) { res.status(500).json({ success:false, error: err.message }); }
};

// Muestra los detalles de un usuario en especifico (solo admin)
const detalleUsuario = async (req, res) => {
  try {
    const usuario = await Usuario.findById(req.params.id).select('-password'); // No muestra la contraseña
    if (!usuario) return res.status(404).json({ success:false, error: 'Usuario no encontrado' });
    res.json({ success:true, data: usuario });
  } catch (err) { res.status(500).json({ success:false, error: err.message }); }
};

// Actualiza los detalles del usuario
const actualizarUsuario = async (req, res) => {
  try {
    // Si no es admin y está intentando actualizar otro usuario
    if (req.usuario.id !== req.params.id && req.usuario.rol !== 'admin') {
      return res.status(403).json({ success:false, error: 'Solo puedes actualizar tu propio perfil' });
    }
    // Evita cambiar rol vía body si no es admin
    const updated = { ...req.body };
    if (req.body.rol && req.usuario.rol !== 'admin') delete updated.rol;
    const usuario = await Usuario.findByIdAndUpdate(req.params.id, updated, { new: true }).select('-password');
    if (!usuario) return res.status(404).json({ success:false, error: 'Usuario no encontrado' });
    res.json({ success:true, data: usuario });
  } catch (err) { res.status(500).json({ success:false, error: err.message }); }
};

// Cambiar contraseña
const bcrypt = require('bcryptjs');
const cambiarPassword = async (req, res) => {
  try {
    const { actual, nueva } = req.body;
    // Validar datos obligatorios
    if (!actual || !nueva) {
      return res.status(400).json({ success: false, error: 'Debes ingresar la contraseña actual y la nueva.' });
    }
    // Buscar el usuario autenticado
    const usuario = await Usuario.findById(req.usuario.id);
    if (!usuario) {
      return res.status(404).json({ success: false, error: 'Usuario no encontrado.' });
    }
    // Verificar la contraseña actual
    const esValido = await usuario.compararPassword(actual);
    if (!esValido) {
      return res.status(400).json({ success: false, error: 'La contraseña actual es incorrecta.' });
    }
    // Hashear la nueva contraseña antes de guardarla
    const hash = await bcrypt.hash(nueva, 10);
    usuario.password = hash;
    await usuario.save();
    res.json({ success: true, message: 'Contraseña actualizada correctamente.' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
    }
};

// Elimina el usuario
const eliminarUsuario = async (req, res) => {
  try {
    // Solo admin o el propio usuario puede eliminar
    if (req.usuario.id !== req.params.id && req.usuario.rol !== 'admin') {
      return res.status(403).json({ success:false, error: 'No autorizado' });
    }
    const usuario = await Usuario.findByIdAndDelete(req.params.id);
    if (!usuario) return res.status(404).json({ success:false, error: 'Usuario no encontrado' });
    // Elimina el carrito asociado
    await Carrito.findOneAndDelete({ usuario: usuario._id });
    res.json({ success:true, message: 'Usuario y carrito eliminados' });
  } catch (err) { res.status(500).json({ success:false, error: err.message }); }
};

module.exports = { registrarUsuario, loginUsuario, listarUsuarios, detalleUsuario, actualizarUsuario, eliminarUsuario, cambiarPassword };
