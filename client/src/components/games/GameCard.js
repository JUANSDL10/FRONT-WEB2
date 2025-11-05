import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';

const GameCard = ({ game }) => {
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/producto/${game._id}`);
  };

  const handleAddToCart = (e) => {
    e.stopPropagation(); // Evita que el click se propague al card
    if (!isAuthenticated) {
      alert('Debes iniciar sesión para agregar productos al carrito');
      return;
    }
    addToCart(game);
  };

  const handleAddToWishlist = (e) => {
    e.stopPropagation(); // Evita que el click se propague al card
    if (!isAuthenticated) {
      alert('Debes iniciar sesión para agregar a lista de deseos');
      return;
    }
    alert(`${game.nombre_juego} agregado a lista de deseos`);
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push('★');
    }
    if (hasHalfStar) {
      stars.push('½');
    }
    while (stars.length < 5) {
      stars.push('☆');
    }

    return stars.join('');
  };

  return (
    <div className="card" onClick={handleCardClick} style={{ cursor: 'pointer' }}>
      {game.badge && (
        <div className="card__badge">{game.badge}</div>
      )}
      
      <div className="card__image-container">
        <img src={game.image} alt={game.nombre_juego} />
      </div>
      
      <div className="card__body">
        <div className="card__platform">{game.platform}</div>
        <h3 className="card__title">{game.nombre_juego}</h3>
        
        <div className="card__rating">
          <span className="stars">
            {renderStars(game.rating)}
          </span>
          <span>({game.rating})</span>
        </div>

        <div className="card__price">
          <div>
            <div className="price">${game.precio} MXN</div>
            {game.precioOriginal && (
              <div className="price--old">${game.precioOriginal} MXN</div>
            )}
          </div>
        </div>

        <div className="card__actions">
          <button 
            className="btn btn--primary" 
            style={{ flex: 1 }}
            onClick={handleAddToCart}
          >
            🛒 Agregar
          </button>
          <button 
            className="btn btn--ghost"
            onClick={handleAddToWishlist}
          >
            ❤️
          </button>
        </div>
      </div>
    </div>
  );
};

export default GameCard;