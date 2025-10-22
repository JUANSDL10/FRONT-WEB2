import React from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const CartPage = () => {
  const { cartItems, removeFromCart, updateQuantity, totalPrice, totalItems } = useCart();
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return (
      <section className="section container">
        <h2>🛒 Carrito de Compras</h2>
        <div style={{ textAlign: 'center', padding: '3rem', color: '#9aa3af' }}>
          <p>Debes iniciar sesión para ver tu carrito</p>
        </div>
      </section>
    );
  }

  return (
    <section className="section container">
      <h2>🛒 Carrito de Compras</h2>
      <div className="cart">
        <h3>🎮 Tus productos ({totalItems} artículos)</h3>
        
        {cartItems.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2rem', color: '#9aa3af' }}>
            <p>Tu carrito está vacío</p>
          </div>
        ) : (
          <>
            <div id="cartItems">
              {cartItems.map(item => (
                <div key={item._id} className="cart-item">
                  <img src={item.image} alt={item.nombre_juego} />
                  <div className="cart-item__info">
                    <h4 className="cart-item__title">{item.nombre_juego}</h4>
                    <p className="cart-item__platform">{item.platform}</p>
                    <div className="cart-item__price">${item.precio} MXN c/u</div>
                  </div>
                  <div>
                    <button 
                      className="btn btn--ghost" 
                      onClick={() => updateQuantity(item._id, item.quantity - 1)}
                    >
                      -
                    </button>
                    <span style={{ margin: '0 10px' }}>{item.quantity}</span>
                    <button 
                      className="btn btn--ghost" 
                      onClick={() => updateQuantity(item._id, item.quantity + 1)}
                    >
                      +
                    </button>
                    <button 
                      className="btn btn--ghost" 
                      onClick={() => removeFromCart(item._id)}
                      style={{ marginLeft: '10px', color: '#ff1e1e' }}
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="cart-total">
              <p>Subtotal: <strong>${totalPrice} MXN</strong></p>
              <button className="btn btn--primary" style={{ marginTop: '1rem' }}>
                💳 Proceder al pago
              </button>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default CartPage;