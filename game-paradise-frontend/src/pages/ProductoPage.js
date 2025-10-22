import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const ProductoPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const [cantidad, setCantidad] = useState(1);
  const [imagenPrincipal, setImagenPrincipal] = useState(0);

  // Datos de ejemplo del producto
  const producto = {
    _id: id || 'game1',
    nombre_juego: 'Super Mario Odyssey',
    precio: 1300,
    cantidad: 50,
    informacion: 'Una increíble aventura de Mario por diferentes reinos. Explora mundos fascinantes y descubre secretos ocultos en esta épica aventura.',
    vendedor: 'GameStore Official',
    platform: 'Nintendo Switch',
    company: 'Nintendo',
    rating: 4.8,
    images: [
      'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=500&h=500&fit=crop',
      'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=500&h=500&fit=crop',
      'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=500&h=500&fit=crop'
    ]
  };

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      alert('Debes iniciar sesión para agregar productos al carrito');
      navigate('/auth');
      return;
    }

    for (let i = 0; i < cantidad; i++) {
      addToCart(producto);
    }
    
    alert(`${cantidad} ${producto.nombre_juego} agregado(s) al carrito`);
  };

  const handleAddToWishlist = () => {
    if (!isAuthenticated) {
      alert('Debes iniciar sesión para agregar a lista de deseos');
      navigate('/auth');
      return;
    }
    alert(`${producto.nombre_juego} agregado a lista de deseos`);
  };

  return (
    <section className="section container">
      <div className="producto-page">
        <div className="producto-content">
          
          {/* Columna izquierda: Galería de imágenes */}
          <aside className="producto-gallery">
            <div className="imagen-principal">
              <img 
                src={producto.images[imagenPrincipal]} 
                alt={producto.nombre_juego}
                className="producto-imagen"
              />
            </div>
            
            <div className="miniaturas">
              {producto.images.map((imagen, index) => (
                <button
                  key={index}
                  type="button"
                  className={`miniatura-btn ${imagenPrincipal === index ? 'active' : ''}`}
                  onClick={() => setImagenPrincipal(index)}
                  aria-label={`Ver imagen ${index + 1}`}
                >
                  <img 
                    src={imagen} 
                    alt={`Miniatura ${index + 1}`}
                    className="miniatura-imagen"
                  />
                </button>
              ))}
            </div>
          </aside>

          {/* Columna derecha: Detalles del producto */}
          <main className="producto-details">
            <div className="producto-header">
              <h1>{producto.nombre_juego}</h1>
              <button 
                type="button" 
                className="wishlist-btn"
                onClick={handleAddToWishlist}
                aria-label="Agregar a favoritos"
              >
                ♡
              </button>
            </div>

            <div className="producto-platform">
              <span className="platform-badge">{producto.platform}</span>
              <div className="producto-rating">
                <span className="stars">★★★★★</span>
                <span>({producto.rating})</span>
              </div>
            </div>

            <div className="producto-precio">
              <strong className="precio">${producto.precio} MXN</strong>
            </div>

            <section className="producto-descripcion">
              <h2>Sobre este producto:</h2>
              <p>{producto.informacion}</p>
              <ul className="producto-caracteristicas">
                <li>🎮 Aventura en mundo abierto</li>
                <li>🌟 Gráficos en alta definición</li>
                <li>👑 Más de 50 horas de juego</li>
                <li>🎯 Modo multijugador disponible</li>
              </ul>
            </section>

            <form className="purchase-form" onSubmit={(e) => e.preventDefault()}>
              <div className="cantidad-group">
                <label htmlFor="cantidad">Cantidad</label>
                <div className="cantidad-controls">
                  <button 
                    type="button" 
                    className="cantidad-btn"
                    onClick={() => setCantidad(Math.max(1, cantidad - 1))}
                  >
                    -
                  </button>
                  <input 
                    id="cantidad"
                    name="cantidad" 
                    type="number" 
                    min="1" 
                    max="10"
                    value={cantidad}
                    onChange={(e) => setCantidad(Math.max(1, parseInt(e.target.value) || 1))}
                    className="cantidad-input"
                  />
                  <button 
                    type="button" 
                    className="cantidad-btn"
                    onClick={() => setCantidad(Math.min(10, cantidad + 1))}
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="vendedor-info">
                <p>🛍️ <strong>Vendedor:</strong> {producto.vendedor}</p>
                <p>📦 <strong>Disponibles:</strong> {producto.cantidad} unidades</p>
                <p>🚚 <strong>Envío gratis</strong> en compras mayores a $500 MXN</p>
              </div>

              <div className="producto-actions">
                <button 
                  type="button" 
                  className="btn btn--primary btn--large"
                  onClick={handleAddToCart}
                >
                  🛒 Agregar al Carrito
                </button>
                <button 
                  type="button" 
                  className="btn btn--accent btn--large"
                >
                  💳 Comprar Ahora
                </button>
              </div>
            </form>
          </main>
        </div>

        {/* Sección de productos relacionados */}
        <div className="productos-relacionados">
          <h2>Productos Relacionados</h2>
          <div className="relacionados-grid">
            <div className="producto-relacionado">
              <img src="https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=200&h=200&fit=crop" alt="The Legend of Zelda" />
              <h3>The Legend of Zelda</h3>
              <p>$1,400 MXN</p>
            </div>
            <div className="producto-relacionado">
              <img src="https://images.unsplash.com/photo-1542751371-adc38448a05e?w=200&h=200&fit=crop" alt="Animal Crossing" />
              <h3>Animal Crossing</h3>
              <p>$1,350 MXN</p>
            </div>
            <div className="producto-relacionado">
              <img src="https://images.unsplash.com/photo-1511512578047-dfb367046420?w=200&h=200&fit=crop" alt="Mario Kart 8" />
              <h3>Mario Kart 8</h3>
              <p>$1,200 MXN</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductoPage;