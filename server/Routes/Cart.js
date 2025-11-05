const express = require('express');
const router = express.Router();
const Cart = require('../Models/Model_cart');
const Games = require('../Models/Model_games');
const User = require('../Models/Model_user');

// GET /api/cart/:userId - Obtener carrito de un usuario específico
router.get('/:userId', async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.params.userId })
      .populate('user', 'username email')
      .populate('items.game', 'Nombre_juego Precio image Cantidad');

    if (!cart) {
      // Crear carrito vacío si no existe
      const newCart = new Cart({
        user: req.params.userId,
        items: [],
        total: 0
      });
      const savedCart = await newCart.save();
      await savedCart.populate('user', 'username email');
      return res.json(savedCart);
    }

    // Verificar que los juegos aún existan y tengan stock
    const validItems = [];
    let newTotal = 0;

    for (const item of cart.items) {
      const game = await Games.findById(item.game);
      if (game && game.Cantidad >= item.quantity) {
        validItems.push(item);
        newTotal += item.price * item.quantity;
      }
    }

    // Actualizar carrito si hay items inválidos
    if (validItems.length !== cart.items.length) {
      cart.items = validItems;
      cart.total = newTotal;
      cart.updatedAt = new Date();
      await cart.save();
    }

    await cart.populate('items.game', 'Nombre_juego Precio image Cantidad');
    
    res.json(cart);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el carrito' });
  }
});

// POST /api/cart/:userId/add - Agregar juego al carrito
router.post('/:userId/add', async (req, res) => {
  try {
    const { gameId, quantity = 1 } = req.body;

    // Validaciones
    if (!gameId) {
      return res.status(400).json({ error: 'ID del juego requerido' });
    }

    if (quantity < 1) {
      return res.status(400).json({ error: 'La cantidad debe ser al menos 1' });
    }

    // Verificar que el juego existe y tiene stock
    const game = await Games.findById(gameId);
    if (!game) {
      return res.status(404).json({ error: 'Juego no encontrado' });
    }

    if (game.Cantidad < quantity) {
      return res.status(400).json({ 
        error: `Stock insuficiente. Solo quedan ${game.Cantidad} unidades` 
      });
    }

    // Buscar o crear carrito
    let cart = await Cart.findOne({ user: req.params.userId });

    if (!cart) {
      cart = new Cart({
        user: req.params.userId,
        items: [],
        total: 0
      });
    }

    // Verificar si el juego ya está en el carrito
    const existingItemIndex = cart.items.findIndex(
      item => item.game.toString() === gameId
    );

    if (existingItemIndex > -1) {
      // Actualizar cantidad si ya existe
      const newQuantity = cart.items[existingItemIndex].quantity + quantity;
      
      if (game.Cantidad < newQuantity) {
        return res.status(400).json({ 
          error: `Stock insuficiente. No puedes agregar más unidades` 
        });
      }

      cart.items[existingItemIndex].quantity = newQuantity;
      cart.items[existingItemIndex].price = game.Precio;
    } else {
      // Agregar nuevo item
      cart.items.push({
        game: gameId,
        quantity: quantity,
        price: game.Precio
      });
    }

    // Calcular total
    cart.total = cart.items.reduce((total, item) => {
      return total + (item.price * item.quantity);
    }, 0);

    cart.updatedAt = new Date();

    const savedCart = await cart.save();
    await savedCart.populate('items.game', 'Nombre_juego Precio image Cantidad');
    await savedCart.populate('user', 'username email');

    res.status(201).json({
      message: 'Juego agregado al carrito',
      cart: savedCart
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// PUT /api/cart/:userId/update - Actualizar cantidad de un item
router.put('/:userId/update', async (req, res) => {
  try {
    const { gameId, quantity } = req.body;

    if (!gameId || quantity === undefined) {
      return res.status(400).json({ error: 'ID del juego y cantidad requeridos' });
    }

    if (quantity < 1) {
      return res.status(400).json({ error: 'La cantidad debe ser al menos 1' });
    }

    // Verificar stock
    const game = await Games.findById(gameId);
    if (!game) {
      return res.status(404).json({ error: 'Juego no encontrado' });
    }

    if (game.Cantidad < quantity) {
      return res.status(400).json({ 
        error: `Stock insuficiente. Solo quedan ${game.Cantidad} unidades` 
      });
    }

    const cart = await Cart.findOne({ user: req.params.userId });
    if (!cart) {
      return res.status(404).json({ error: 'Carrito no encontrado' });
    }

    const itemIndex = cart.items.findIndex(
      item => item.game.toString() === gameId
    );

    if (itemIndex === -1) {
      return res.status(404).json({ error: 'Juego no encontrado en el carrito' });
    }

    // Actualizar cantidad y precio
    cart.items[itemIndex].quantity = quantity;
    cart.items[itemIndex].price = game.Precio;

    // Recalcular total
    cart.total = cart.items.reduce((total, item) => {
      return total + (item.price * item.quantity);
    }, 0);

    cart.updatedAt = new Date();

    const updatedCart = await cart.save();
    await updatedCart.populate('items.game', 'Nombre_juego Precio image Cantidad');
    await updatedCart.populate('user', 'username email');

    res.json({
      message: 'Carrito actualizado',
      cart: updatedCart
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// DELETE /api/cart/:userId/remove - Remover item del carrito
router.delete('/:userId/remove', async (req, res) => {
  try {
    const { gameId } = req.body;

    if (!gameId) {
      return res.status(400).json({ error: 'ID del juego requerido' });
    }

    const cart = await Cart.findOne({ user: req.params.userId });
    if (!cart) {
      return res.status(404).json({ error: 'Carrito no encontrado' });
    }

    const initialLength = cart.items.length;
    cart.items = cart.items.filter(
      item => item.game.toString() !== gameId
    );

    if (cart.items.length === initialLength) {
      return res.status(404).json({ error: 'Juego no encontrado en el carrito' });
    }

    // Recalcular total
    cart.total = cart.items.reduce((total, item) => {
      return total + (item.price * item.quantity);
    }, 0);

    cart.updatedAt = new Date();

    const updatedCart = await cart.save();
    await updatedCart.populate('items.game', 'Nombre_juego Precio image Cantidad');
    await updatedCart.populate('user', 'username email');

    res.json({
      message: 'Juego removido del carrito',
      cart: updatedCart
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// DELETE /api/cart/:userId/clear - Vaciar el carrito
router.delete('/:userId/clear', async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.params.userId });
    if (!cart) {
      return res.status(404).json({ error: 'Carrito no encontrado' });
    }

    cart.items = [];
    cart.total = 0;
    cart.updatedAt = new Date();

    const clearedCart = await cart.save();
    await clearedCart.populate('user', 'username email');

    res.json({
      message: 'Carrito vaciado',
      cart: clearedCart
    });
  } catch (error) {
    res.status(500).json({ error: 'Error al vaciar el carrito' });
  }
});

module.exports = router;