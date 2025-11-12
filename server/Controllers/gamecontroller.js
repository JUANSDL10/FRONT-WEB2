const Games = require('../Models/Model_games');
const Media = require('../Models/Model_media');

// Crear juego - FUNCIÓN SIMPLE
const createGame = async (req, res) => {
  try {
    console.log('🎮 Creando juego...');
    console.log('📝 Datos recibidos:', req.body);
    console.log('📸 Archivos recibidos:', req.files ? req.files.length : 0);

    const {
      nombre, cantidad, precio, informacion, plataforma, categoria, compania
    } = req.body;

    // 1. Crear el juego en la base de datos
    const nuevoJuego = new Games({
      Nombre_juego: nombre,
      Cantidad: parseInt(cantidad),
      Precio: parseFloat(precio),
      Informacion: informacion,
      plataforma: plataforma,
      categoria: categoria,
      compania: compania || null,
      Vendedor: req.user.id, // Del middleware auth
      imagenes: [] // Se llenará después
    });

    const juegoGuardado = await nuevoJuego.save();
    console.log('✅ Juego guardado en BD:', juegoGuardado._id);

    // 2. Crear registros en Media para cada imagen
    if (req.files && req.files.length > 0) {
      const mediaPromises = req.files.map(async (file) => {
        const nuevoMedia = new Media({
          filename: file.filename,
          juego: juegoGuardado._id
        });
        return await nuevoMedia.save();
      });

      const mediaCreado = await Promise.all(mediaPromises);
      console.log('✅ Medias creados:', mediaCreado.length);

      // 3. Actualizar el juego con las referencias a las imágenes
      juegoGuardado.imagenes = mediaCreado.map(media => media._id);
      await juegoGuardado.save();
    }

    // 4. Respuesta exitosa
    res.json({
      success: true,
      message: '🎉 ¡Juego creado exitosamente y guardado en la base de datos!',
      game: {
        id: juegoGuardado._id,
        nombre: juegoGuardado.Nombre_juego,
        precio: juegoGuardado.Precio,
        cantidad: juegoGuardado.Cantidad,
        imagenes: juegoGuardado.imagenes.length,
        fecha: juegoGuardado.createdAt
      }
    });

  } catch (error) {
    console.error('❌ Error en createGame:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Obtener todos los juegos - FUNCIÓN SIMPLE
const getAllGames = async (req, res) => {
  try {
    const games = await Games.find({ activo: true });
    res.json({
      success: true,
      count: games.length,
      games
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Error al obtener juegos'
    });
  }
};

// Exportar
module.exports = {
  createGame,
  getAllGames
};