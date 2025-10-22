import React, { createContext, useState, useContext } from 'react';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart debe ser usado dentro de un CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  const addToCart = (game) => {
    setCartItems(prev => {
      const existingItem = prev.find(item => item._id === game._id);
      
      if (existingItem) {
        return prev.map(item =>
          item._id === game._id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prev, { ...game, quantity: 1 }];
      }
    });
    
    alert(`${game.nombre_juego} agregado al carrito`);
  };

  const removeFromCart = (gameId) => {
    setCartItems(prev => prev.filter(item => item._id !== gameId));
  };

  const updateQuantity = (gameId, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(gameId);
      return;
    }

    setCartItems(prev =>
      prev.map(item =>
        item._id === gameId
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + (item.precio * item.quantity), 0);
  };

  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    totalItems: getTotalItems(),
    totalPrice: getTotalPrice()
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};