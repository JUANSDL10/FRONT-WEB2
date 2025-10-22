import React, { createContext, useState, useContext, useEffect } from 'react';

const GameContext = createContext();

export const useGames = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGames debe ser usado dentro de un GameProvider');
  }
  return context;
};

export const GameProvider = ({ children }) => {
  const [games, setGames] = useState([]);
  const [filteredGames, setFilteredGames] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState('all');
  const [loading, setLoading] = useState(true);

  // Datos de ejemplo - en producción vendrían de una API
  const mockGames = [
    {
      _id: 'game1',
      nombre_juego: 'Super Mario Odyssey',
      cantidad: 50,
      precio: 1300,
      informacion: 'Una increíble aventura de Mario por diferentes reinos',
      vendedor: 'user1',
      company: 'comp1',
      categories: ['cat1'],
      platform: 'Nintendo Switch',
      image: 'https://images.unsplash.com/photo-1551103782-8ab07afd45c1?w=400&h=300&fit=crop',
      badge: 'Más vendido',
      rating: 4.8,
      releaseDate: '2020-10-27'
    },
    {
      _id: 'game2',
      nombre_juego: 'Halo Infinite',
      cantidad: 30,
      precio: 960,
      informacion: 'La última entrega de la saga Halo',
      vendedor: 'user1',
      company: 'comp2',
      categories: ['cat2'],
      platform: 'Xbox Series X|S',
      image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=400&h=300&fit=crop',
      badge: 'Oferta -20%',
      precioOriginal: 1200,
      rating: 4.5,
      releaseDate: '2021-12-08'
    },
    {
      _id: 'game3',
      nombre_juego: 'The Legend of Zelda: Breath of the Wild',
      cantidad: 45,
      precio: 1400,
      informacion: 'Explora el vasto mundo de Hyrule',
      vendedor: 'user1',
      company: 'comp1',
      categories: ['cat1', 'cat3'],
      platform: 'Nintendo Switch',
      image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=400&h=300&fit=crop',
      badge: 'Nuevo',
      rating: 4.9,
      releaseDate: '2023-05-12'
    },
    {
      _id: 'game4',
      nombre_juego: 'God of War Ragnarök',
      cantidad: 25,
      precio: 1499,
      informacion: 'La épica continuación de la saga nórdica',
      vendedor: 'user1',
      company: 'comp3',
      categories: ['cat2', 'cat1'],
      platform: 'PlayStation 5',
      image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=400&h=300&fit=crop',
      rating: 4.7,
      releaseDate: '2022-11-09'
    },
    {
      _id: 'game5',
      nombre_juego: 'Forza Horizon 5',
      cantidad: 35,
      precio: 1100,
      informacion: 'Carreras en los vibrantes paisajes de México',
      vendedor: 'user1',
      company: 'comp2',
      categories: ['cat4'],
      platform: 'Xbox Series X|S',
      image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=400&h=300&fit=crop',
      badge: 'Popular',
      rating: 4.6,
      releaseDate: '2021-11-09'
    },
    {
      _id: 'game6',
      nombre_juego: 'Cyberpunk 2077',
      cantidad: 40,
      precio: 899,
      informacion: 'RPG de mundo abierto en Night City',
      vendedor: 'user1',
      company: 'comp4',
      categories: ['cat3', 'cat2'],
      platform: 'PC',
      image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=400&h=300&fit=crop',
      precioOriginal: 1200,
      rating: 4.3,
      releaseDate: '2020-12-10'
    },
    {
      _id: 'game7',
      nombre_juego: 'Animal Crossing: New Horizons',
      cantidad: 60,
      precio: 1350,
      informacion: 'Crea tu paraíso insular',
      vendedor: 'user1',
      company: 'comp1',
      categories: ['cat5'],
      platform: 'Nintendo Switch',
      image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=400&h=300&fit=crop',
      rating: 4.8,
      releaseDate: '2020-03-20'
    },
    {
      _id: 'game8',
      nombre_juego: 'Spider-Man 2',
      cantidad: 20,
      precio: 1599,
      informacion: 'Doble la emoción, doble los héroes',
      vendedor: 'user1',
      company: 'comp3',
      categories: ['cat2', 'cat1'],
      platform: 'PlayStation 5',
      image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=400&h=300&fit=crop',
      badge: 'Exclusivo',
      rating: 4.9,
      releaseDate: '2023-10-20'
    }
  ];

  useEffect(() => {
    // Simular carga de datos
    setTimeout(() => {
      setGames(mockGames);
      setFilteredGames(mockGames);
      setLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    let results = games;
    
    // Filtrar por búsqueda
    if (searchTerm) {
      results = results.filter(game =>
        game.nombre_juego.toLowerCase().includes(searchTerm.toLowerCase()) ||
        game.platform.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Filtrar por plataforma
    if (selectedPlatform !== 'all') {
      results = results.filter(game => game.platform === selectedPlatform);
    }
    
    setFilteredGames(results);
  }, [searchTerm, selectedPlatform, games]);

  const searchGames = (term) => {
    setSearchTerm(term);
  };

  const filterByPlatform = (platform) => {
    setSelectedPlatform(platform);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedPlatform('all');
  };

  const value = {
    games: filteredGames,
    allGames: games,
    loading,
    searchGames,
    filterByPlatform,
    clearFilters,
    searchTerm,
    selectedPlatform
  };

  return (
    <GameContext.Provider value={value}>
      {children}
    </GameContext.Provider>
  );
};