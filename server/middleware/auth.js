const mongoose = require('mongoose'); // ✅ Agregar esta línea

module.exports = (req, res, next) => {
  // ✅ USAR UN ObjectId VÁLIDO
  console.log('🔐 Middleware auth - ACCESO PERMITIDO');
  req.user = { 
    id: new mongoose.Types.ObjectId(), // ✅ ObjectId válido
    Rol: 'vendedor',
    Nombre_usuario: 'Usuario de Prueba'
  };
  next();
};