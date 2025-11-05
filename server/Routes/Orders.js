const express = require('express');
const router = express.Router();
const Order = require('../Models/Model_orders');
const Cart = require('../Models/Model_cart');
const Games = require('../Models/Model_games');
const User = require('../Models/Model_user');

// POST /api/orders - Crear una nueva orden desde el carrito
router.post('/', async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { userId, metodoPago } = req.body;

    if (!userId || !metodoPago) {
      return res.status(400).json({ 
        error: 'userId y metodoPago son requeridos' 
      });
    }

    // Obtener carrito del usuario
    const cart = await Cart.findOne({ user: userId })
      .populate('items.game', 'Nombre_juego Precio Cantidad');
    
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ error: 'Carrito vacío' });
    }

    // Verificar stock y precios actualizados
    let total = 0;
    const orderItems = [];

    for (const item of cart.items) {
      const game = await Games.findById(item.game._id).session(session);
      
      if (!game) {
        await session.abortTransaction();
        session.endSession();
        return res.status(404).json({ 
          error: `Juego "${item.game.Nombre_juego}" no encontrado` 
        });
      }

      if (game.Cantidad < item.quantity) {
        await session.abortTransaction();
        session.endSession();
        return res.status(400).json({ 
          error: `Stock insuficiente para "${game.Nombre_juego}". Solo quedan ${game.Cantidad} unidades` 
        });
      }

      // Usar el precio actual del juego, no el del carrito
      const precioActual = game.Precio;
      total += precioActual * item.quantity;

      orderItems.push({
        game: game._id,
        cantidad: item.quantity,
        precio: precioActual
      });

      // Reducir stock
      game.Cantidad -= item.quantity;
      await game.save({ session });
    }

    // Crear la orden
    const newOrder = new Order({
      user: userId,
      items: orderItems,
      total: total,
      metodoPago: metodoPago
    });

    const savedOrder = await newOrder.save({ session });

    // Vaciar carrito
    cart.items = [];
    cart.total = 0;
    cart.updatedAt = new Date();
    await cart.save({ session });

    await session.commitTransaction();
    session.endSession();

    // Populate para respuesta
    await savedOrder.populate('user', 'username email');
    await savedOrder.populate('items.game', 'Nombre_juego image');

    res.status(201).json({
      message: 'Orden creada exitosamente',
      order: savedOrder
    });

  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    res.status(400).json({ error: error.message });
  }
});

// GET /api/orders/user/:userId - Obtener órdenes de un usuario
router.get('/user/:userId', async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      sort: { fecha: -1 },
      populate: [
        { path: 'user', select: 'username email' },
        { path: 'items.game', select: 'Nombre_juego image' }
      ]
    };

    const orders = await Order.paginate(
      { user: req.params.userId },
      options
    );

    res.json({
      orders: orders.docs,
      total: orders.totalDocs,
      pages: orders.totalPages,
      currentPage: orders.page
    });
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener las órdenes' });
  }
});

// GET /api/orders - Obtener todas las órdenes (admin)
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    let filter = {};

    if (status) filter.estado = status;

    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      sort: { fecha: -1 },
      populate: [
        { path: 'user', select: 'username email' },
        { path: 'items.game', select: 'Nombre_juego' }
      ]
    };
    const orders = await Order.paginate(filter, options);

    res.json({
      orders: orders.docs,
      total: orders.totalDocs,
      pages: orders.totalPages,
      currentPage: orders.page
    });
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener las órdenes' });
  }
});

module.exports = router;