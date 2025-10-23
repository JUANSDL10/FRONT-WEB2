import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const ProfilePage = () => {
  const { currentUser, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('perfil');

  // Datos de ejemplo para usuario no logueado
  const guestUser = {
    nombre_usuario: 'Invitado',
    correo: 'invitado@ejemplo.com',
    telefono: 'No especificado',
    sexo: 'No especificado'
  };

  const user = isAuthenticated ? currentUser : guestUser;

  const handleLoginRedirect = () => {
    navigate('/auth');
  };

  const handleRegisterRedirect = () => {
    navigate('/auth');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      alert('Debes iniciar sesión para editar tu perfil');
      return;
    }
    alert('Perfil actualizado (simulación)');
  };

  return (
    <section className="section container">
      <div className="profile-section">
        <div className="section__head">
          <h2>👤 Perfil de Usuario</h2>
          <p>
            {isAuthenticated 
              ? 'Gestiona tu información personal y preferencias' 
              : 'Inicia sesión para acceder a todas las funciones de tu perfil'
            }
          </p>
        </div>

        {!isAuthenticated && (
          <div className="guest-banner">
            <div className="guest-message">
              <h3>🔒 No has iniciado sesión</h3>
              <p>Inicia sesión o regístrate para acceder a todas las funciones de tu perfil</p>
              <div className="guest-actions">
                <button onClick={handleLoginRedirect} className="btn btn--primary">
                  🚀 Iniciar Sesión
                </button>
                <button onClick={handleRegisterRedirect} className="btn btn--ghost">
                  📝 Registrarse
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tabs de navegación */}
        <div className="profile-tabs">
          <button 
            className={`profile-tab ${activeTab === 'perfil' ? 'active' : ''}`}
            onClick={() => setActiveTab('perfil')}
          >
            👤 Información Personal
          </button>
          <button 
            className={`profile-tab ${activeTab === 'pedidos' ? 'active' : ''}`}
            onClick={() => setActiveTab('pedidos')}
          >
            🛒 Mis Pedidos
          </button>
          <button 
            className={`profile-tab ${activeTab === 'deseos' ? 'active' : ''}`}
            onClick={() => setActiveTab('deseos')}
          >
            ❤️ Lista de Deseos
          </button>
        </div>

        {/* Contenido de las tabs */}
        <div className="profile-content">
          {activeTab === 'perfil' && (
            <div className="tab-content active">
              <div className="profile-header">
                <div className="profile-avatar">
                  <img 
                    src="https://cdn-icons-png.flaticon.com/512/847/847969.png" 
                    alt="Icono de usuario" 
                    width="120"
                  />
                  {!isAuthenticated && (
                    <div className="guest-badge">Invitado</div>
                  )}
                </div>
                <div className="profile-info">
                  <h3>{user.nombre_usuario}</h3>
                  <p>📧 {user.correo}</p>
                  <p>📞 {user.telefono}</p>
                  <p>⚧️ {user.sexo}</p>
                  {isAuthenticated && (
                    <p>🎮 Gamer desde 2024 • ⭐ Miembro Premium</p>
                  )}
                </div>
              </div>

              <div className="profile-form-container">
                <h3>Información Personal</h3>
                <form onSubmit={handleSubmit} className="profile-form">
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="nombre">Nombre:</label>
                      <input 
                        type="text" 
                        id="nombre"
                        name="nombre" 
                        className="form-control"
                        placeholder="Tu nombre"
                        defaultValue={user.nombre_usuario}
                        disabled={!isAuthenticated}
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="apellido">Apellido:</label>
                      <input 
                        type="text" 
                        id="apellido"
                        name="apellido" 
                        className="form-control"
                        placeholder="Tu apellido"
                        disabled={!isAuthenticated}
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="correo">Correo electrónico:</label>
                    <input 
                      type="email" 
                      id="correo"
                      name="correo" 
                      className="form-control"
                      placeholder="tu@email.com"
                      defaultValue={user.correo}
                      disabled={!isAuthenticated}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="telefono">Teléfono:</label>
                    <input 
                      type="tel" 
                      id="telefono"
                      name="telefono" 
                      className="form-control"
                      placeholder="+52 123 456 7890"
                      defaultValue={user.telefono}
                      disabled={!isAuthenticated}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="sexo">Sexo:</label>
                    <select 
                      id="sexo" 
                      name="sexo" 
                      className="form-select" 
                      defaultValue={user.sexo}
                      disabled={!isAuthenticated}
                    >
                      <option value="">Selecciona tu sexo</option>
                      <option value="Masculino">Masculino</option>
                      <option value="Femenino">Femenino</option>
                      <option value="Otro">Otro</option>
                      <option value="Prefiero no decirlo">Prefiero no decirlo</option>
                    </select>
                  </div>

                  {isAuthenticated && (
                    <>
                      <div className="form-group">
                        <label htmlFor="password">Nueva Contraseña:</label>
                        <input 
                          type="password" 
                          id="password"
                          name="password" 
                          className="form-control"
                          placeholder="Deja en blanco para no cambiar"
                        />
                        <small className="form-help">Mínimo 6 caracteres</small>
                      </div>

                      <div className="form-group">
                        <label htmlFor="confirmPassword">Confirmar Contraseña:</label>
                        <input 
                          type="password" 
                          id="confirmPassword"
                          name="confirmPassword" 
                          className="form-control"
                          placeholder="Repite la nueva contraseña"
                        />
                      </div>
                    </>
                  )}

                  <div className="form-actions">
                    <button 
                      type="submit" 
                      className="btn btn--primary"
                      disabled={!isAuthenticated}
                    >
                      {isAuthenticated ? '💾 Guardar Cambios' : '🔒 Inicia sesión para editar'}
                    </button>
                    {isAuthenticated && (
                      <button type="button" className="btn btn--ghost">
                        ↩️ Descartar
                      </button>
                    )}
                  </div>
                </form>
              </div>
            </div>
          )}

          {activeTab === 'pedidos' && (
            <div className="tab-content">
              <div className="tab-placeholder">
                <h3>🛒 Mis Pedidos</h3>
                {!isAuthenticated ? (
                  <div className="guest-message-tab">
                    <p>Inicia sesión para ver tu historial de pedidos</p>
                    <button onClick={handleLoginRedirect} className="btn btn--primary">
                      Iniciar Sesión
                    </button>
                  </div>
                ) : (
                  <p>No tienes pedidos realizados</p>
                )}
              </div>
            </div>
          )}

          {activeTab === 'deseos' && (
            <div className="tab-content">
              <div className="tab-placeholder">
                <h3>❤️ Lista de Deseos</h3>
                {!isAuthenticated ? (
                  <div className="guest-message-tab">
                    <p>Inicia sesión para gestionar tu lista de deseos</p>
                    <button onClick={handleLoginRedirect} className="btn btn--primary">
                      Iniciar Sesión
                    </button>
                  </div>
                ) : (
                  <p>No tienes juegos en tu lista de deseos</p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Estadísticas (solo para usuarios logueados) */}
        {isAuthenticated && (
          <div className="profile-stats">
            <h3>Mis Estadísticas</h3>
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon">🛒</div>
                <div className="stat-number">12</div>
                <div className="stat-label">Compras Realizadas</div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">❤️</div>
                <div className="stat-number">8</div>
                <div className="stat-label">En Lista de Deseos</div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">⭐</div>
                <div className="stat-number">15</div>
                <div className="stat-label">Reseñas Publicadas</div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">🎮</div>
                <div className="stat-number">5</div>
                <div className="stat-label">Juegos Publicados</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default ProfilePage;