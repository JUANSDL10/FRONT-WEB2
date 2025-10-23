import React, { createContext, useState, useContext } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);

  const login = (email, password) => {
    // Simulación de login
    const user = {
      _id: 'user1',
      nombre_usuario: 'juanperez',
      correo: email,
      sexo: 'Masculino',
      rol: 'cliente',
      telefono: '8112345678'
    };
    setCurrentUser(user);
    return { success: true };
  };

  const register = async (userData) => {
  try {
    const user = await authService.register(userData);
    setCurrentUser(user);
    localStorage.setItem('currentUser', JSON.stringify(user));
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

  const logout = () => {
    setCurrentUser(null);
  };

  const value = {
    currentUser,
    login,
    register,
    logout,
    isAuthenticated: !!currentUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};