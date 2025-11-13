const express = require('express');
const cors = require('cors');
require('dotenv').config();
const conectarDB = require('./config/db');

const app = express();
conectarDB();
app.use(express.json());

// Rutas
app.use('/api/usuarios', require('./routes/usuarios'));
app.use('/api/productos', require('./routes/productos'));
app.use('/api/categorias', require('./routes/categorias'));
app.use('/api/carritos', require('./routes/carritos'));
app.use('/api/pedidos', require('./routes/pedidos'));
app.use('/api/resenas', require('./routes/resenas'));

// Ruta base
app.get('/', (req, res) => res.json({ success: true, message: 'API Parcial BD2 funcionando' }));

// Middleware global de errores
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ success: false, error: err.message || 'Server error' });
});

// Inicio del servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor en http://localhost:${PORT}`));
