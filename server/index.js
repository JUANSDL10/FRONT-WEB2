// Importar dependencias
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

// Crear una instancia de la aplicación express
const app = express();
const port = process.env.PORT || 3000;

// Middlewares
app.use(cors({
  origin: 'http://localhost:3001', // React normalmente usa puerto 3000, así que cambiamos a 3001
  credentials: true
}));
app.use(express.json());

// Importar rutas
const userRoutes = require('./Routes/User');

// Usar rutas
app.use('/api/users', userRoutes);

// Conectar a MongoDB y luego iniciar el servidor
mongoose.connect('mongodb://localhost:27017/gamecommerce')
  .then(() => {
    console.log('✅ Conectado a MongoDB - gamecommerce');
    
    // Ahora que la DB está conectada, iniciamos el servidor
    app.listen(port, () => {
      console.log(`🚀 Servidor Express escuchando en http://localhost:${port}`);
      console.log(`📊 Rutas disponibles:`);
      console.log(`   http://localhost:${port}/api/users/register`);
      console.log(`   http://localhost:${port}/api/users/login`);
      console.log(`   http://localhost:${port}/api/users`);
    });
  })
  .catch(err => {
    console.error('❌ Error de conexión a MongoDB:', err);
    process.exit(1); // Salir si no puede conectar a la DB
  });