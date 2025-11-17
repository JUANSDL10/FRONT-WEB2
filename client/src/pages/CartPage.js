import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const CartPage = () => {
  const { cartItems, removeFromCart, updateQuantity, totalPrice, totalItems } = useCart();
  const { isAuthenticated } = useAuth();
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);

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
              <button 
                className="btn btn--primary" 
                style={{ marginTop: '1rem' }}
                onClick={() => setShowPaymentModal(true)}
              >
                💳 Proceder al pago
              </button>
            </div>
          </>
        )}
      </div>

      {/* Modal de Pago */}
      {showPaymentModal && (
        <div className="payment-modal-overlay" onClick={() => setShowPaymentModal(false)}>
          <div className="payment-modal" onClick={(e) => e.stopPropagation()}>
            <div className="payment-modal__header">
              <h3>💳 Selecciona método de pago</h3>
              <button 
                className="payment-modal__close"
                onClick={() => setShowPaymentModal(false)}
              >
                ✕
              </button>
            </div>
            
            <div className="payment-modal__body">
              <p className="payment-modal__total">Total a pagar: <strong>${totalPrice} MXN</strong></p>
              
              <div className="payment-methods">
                <div 
                  className={`payment-method ${selectedPaymentMethod === 'tarjeta' ? 'selected' : ''}`}
                  onClick={() => setSelectedPaymentMethod('tarjeta')}
                >
                  <div className="payment-method__icon">💳</div>
                  <div className="payment-method__info">
                    <h4>Tarjeta de crédito/débito</h4>
                    <p>Pago seguro con tarjeta</p>
                  </div>
                  {selectedPaymentMethod === 'tarjeta' && (
                    <div className="payment-method__check">✓</div>
                  )}
                </div>

                <div 
                  className={`payment-method ${selectedPaymentMethod === 'transferencia' ? 'selected' : ''}`}
                  onClick={() => setSelectedPaymentMethod('transferencia')}
                >
                  <div className="payment-method__icon">🏦</div>
                  <div className="payment-method__info">
                    <h4>Transferencia bancaria</h4>
                    <p>Transferencia directa a cuenta bancaria</p>
                  </div>
                  {selectedPaymentMethod === 'transferencia' && (
                    <div className="payment-method__check">✓</div>
                  )}
                </div>
              </div>

              {selectedPaymentMethod && (
                <div className="payment-method__details">
                  {selectedPaymentMethod === 'tarjeta' ? (
                    <div className="payment-form">
                      <div className="form-group">
                        <label>Número de tarjeta</label>
                        <input 
                          type="text" 
                          placeholder="1234 5678 9012 3456"
                          maxLength="19"
                        />
                      </div>
                      <div className="form-row">
                        <div className="form-group">
                          <label>Fecha de vencimiento</label>
                          <input 
                            type="text" 
                            placeholder="MM/AA"
                            maxLength="5"
                          />
                        </div>
                        <div className="form-group">
                          <label>CVV</label>
                          <input 
                            type="text" 
                            placeholder="123"
                            maxLength="4"
                          />
                        </div>
                      </div>
                      <div className="form-group">
                        <label>Nombre del titular</label>
                        <input 
                          type="text" 
                          placeholder="Nombre completo"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="transfer-info">
                      <h4>Datos para transferencia:</h4>
                      <div className="transfer-details">
                        <p><strong>Banco:</strong> Banco Ejemplo</p>
                        <p><strong>CLABE:</strong> 012345678901234567</p>
                        <p><strong>Cuenta:</strong> 1234-5678-9012-3456</p>
                        <p><strong>Beneficiario:</strong> GameStore S.A. de C.V.</p>
                        <p className="transfer-note">
                          ⚠️ Envía el comprobante de transferencia a: compras@gamestore.com
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              <div className="payment-modal__actions">
                <button 
                  className="btn btn--ghost"
                  onClick={() => setShowPaymentModal(false)}
                >
                  Cancelar
                </button>
                <button 
                  className="btn btn--primary"
                  onClick={() => {
                    if (selectedPaymentMethod) {
                      alert(`Procesando pago con ${selectedPaymentMethod === 'tarjeta' ? 'tarjeta' : 'transferencia'}...`);
                      // Aquí iría la lógica para procesar el pago
                      setShowPaymentModal(false);
                      setSelectedPaymentMethod(null);
                    } else {
                      alert('Por favor selecciona un método de pago');
                    }
                  }}
                  disabled={!selectedPaymentMethod}
                >
                  Confirmar pago
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default CartPage;