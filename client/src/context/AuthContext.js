import React, { createContext, useState, useContext } from 'react';
import authService from '../services/authService';

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

  // ✅ LOGIN REAL - Conectado a tu backend
  const login = async (email, password) => {
    try {
      console.log('AuthContext.login recibió:', { email, password });
      const user = await authService.login(email, password);
      setCurrentUser(user);
      localStorage.setItem('currentUser', JSON.stringify(user));
      return { success: true };
    } catch (error) {
      console.error('Error en AuthContext.login:', error);
      return { success: false, error: error.message };
    }
  };
  // ✅ REGISTER REAL - Conectado a tu backend
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
    localStorage.removeItem('currentUser');
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