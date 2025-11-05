const express = require('express');
const router = express.Router();
const Games = require('../Models/Model_games'); // Importar el modelo

// GET /api/games - Obtener todos los videojuegos con filtros opcionales
router.get('/', async (req, res) => {
  try {
    const { category, company, minPrice, maxPrice, search } = req.query;
    let filter = {};
    
    // Filtros opcionales
    if (category) filter.categories = category;
    if (company) filter.company = company;
    if (minPrice || maxPrice) {
      filter.Precio = {};
      if (minPrice) filter.Precio.$gte = Number(minPrice);
      if (maxPrice) filter.Precio.$lte = Number(maxPrice);
    }
    if (search) {
      filter.Nombre_juego = { $regex: search, $options: 'i' };
    }

    const games = await Games.find(filter)
      .populate('Vendedor', 'username email') // Datos básicos del vendedor
      .populate('company', 'name') // Nombre de la compañía
      .populate('categories', 'name') // Nombres de categorías
      .populate('media', 'url type') // Medios asociados
      .populate('rating') // Ratings
      .populate('comments'); // Comentarios

    res.json(games);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener videojuegos' });
  }
});

// GET /api/games/:id - Obtener videojuego por ID
router.get('/:id', async (req, res) => {
  try {
    const game = await Games.findById(req.params.id)
      .populate('Vendedor', 'username email')
      .populate('company', 'name')
      .populate('categories', 'name')
      .populate('media', 'url type')
      .populate('rating')
      .populate('comments');

    if (!game) {
      return res.status(404).json({ error: 'Videojuego no encontrado' });
    }

    res.json(game);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el videojuego' });
  }
});

// POST /api/games - Crear nuevo videojuego
router.post('/', async (req, res) => {
  try {
    const newGame = new Games(req.body);
    const savedGame = await newGame.save();
    
    // Populate para devolver datos completos
    await savedGame.populate('Vendedor', 'username email');
    await savedGame.populate('company', 'name');
    await savedGame.populate('categories', 'name');
    
    res.status(201).json({
      message: 'Videojuego añadido exitosamente',
      game: savedGame
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});
module.exports = router;