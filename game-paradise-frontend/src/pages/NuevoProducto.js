import React from 'react';

const NuevoProducto = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
    // Aquí iría la lógica para enviar el formulario
    alert('Producto creado (simulación)');
  };

  return (
    <section className="section container">
      <div className="nuevo-producto">
        <div className="section__head">
          <h2>➕ Nuevo Producto</h2>
          <p>Agrega un nuevo videojuego al catálogo</p>
        </div>

        <form onSubmit={handleSubmit} className="producto-form">
          <div className="form-group">
            <label htmlFor="nombre">Nombre del juego</label>
            <input 
              type="text" 
              id="nombre"
              name="nombre" 
              className="form-control"
              placeholder="Ej: Super Mario Odyssey"
            />
          </div>

          <div className="fila">
            <div className="form-group">
              <label htmlFor="cantidad">Cantidad</label>
              <input 
                type="number" 
                id="cantidad"
                name="cantidad" 
                className="form-control"
                min="1"
                placeholder="0"
              />
            </div>
            <div className="form-group">
              <label htmlFor="precio">Precio</label>
              <input 
                type="number" 
                id="precio"
                name="precio" 
                step="0.01" 
                className="form-control"
                min="0"
                placeholder="0.00"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="informacion">Información del juego</label>
            <textarea 
              id="informacion"
              name="informacion" 
              className="form-control"
              rows="4"
              placeholder="Descripción del juego..."
            />
          </div>

          <div className="form-group">
            <label htmlFor="platform">Plataforma</label>
            <select id="platform" name="platform" className="form-select">
              <option value="">Selecciona una plataforma</option>
              <option value="Nintendo Switch">Nintendo Switch</option>
              <option value="PlayStation 5">PlayStation 5</option>
              <option value="Xbox Series X|S">Xbox Series X|S</option>
              <option value="PC">PC</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="compania">Compañía</label>
            <select id="compania" name="compania" className="form-select">
              <option value="">Selecciona una compañía</option>
              <option value="Nintendo">Nintendo</option>
              <option value="Microsoft">Microsoft (Xbox)</option>
              <option value="Sony">Sony (PlayStation)</option>
              <option value="Rockstar Games">Rockstar Games</option>
              <option value="Electronic Arts">Electronic Arts</option>
              <option value="Ubisoft">Ubisoft</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="categoria">Categoría</label>
            <select id="categoria" name="categoria" className="form-select">
              <option value="">Selecciona una categoría</option>
              <option value="Aventura">Aventura</option>
              <option value="Acción">Acción</option>
              <option value="RPG">RPG</option>
              <option value="Estrategia">Estrategia</option>
              <option value="Deportes">Deportes</option>
              <option value="Carreras">Carreras</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="imagen">Imagen del juego</label>
            <input 
              type="file" 
              id="imagen"
              name="imagen" 
              accept="image/*"
              className="form-control"
            />
            <small className="form-help">Formatos aceptados: JPG, PNG, GIF</small>
          </div>

          <div className="form-group">
            <label htmlFor="galeria">Galería de imágenes (opcional)</label>
            <input 
              type="file" 
              id="galeria"
              name="galeria" 
              multiple 
              accept="image/*,video/*"
              className="form-control"
            />
            <small className="form-help">Puedes seleccionar múltiples archivos de imagen o video</small>
          </div>

          <div className="form-actions">
            <button type="submit" className="btn btn--primary">
              🎮 Crear Producto
            </button>
            <button type="button" className="btn btn--ghost">
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default NuevoProducto;