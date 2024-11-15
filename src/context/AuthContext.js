// src/context/AuthContext.js
import React, { createContext, useState, useEffect } from 'react';
import jwtDecode from 'jwt-decode';
import api from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    token: localStorage.getItem('token'),
    user: null,
  });

  useEffect(() => {
    if (auth.token) {
      try {
        const decoded = jwtDecode(auth.token);
        setAuth((prev) => ({ ...prev, user: decoded }));
      } catch (error) {
        console.error('Token inválido:', error);
        setAuth({ token: null, user: null });
        localStorage.removeItem('token');
      }
    }
  }, [auth.token]);

  const login = (token) => {
    localStorage.setItem('token', token);
    setAuth({ token, user: jwtDecode(token) });
  };

  const logout = () => {
    localStorage.removeItem('token');
    setAuth({ token: null, user: null });
  };

  return (
    <AuthContext.Provider value={{ auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
