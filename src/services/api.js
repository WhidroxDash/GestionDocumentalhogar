// src/services/api.js
import axios from 'axios';

// Configura la URL base de tu backend
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'https://gsdocumentalhogar.somee.com/SergioPC';

// Crear una instancia de Axios
const api = axios.create({
  baseURL: API_BASE_URL,
});

// Agregar un interceptor para adjuntar el token en las solicitudes
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Manejo de errores globales (opcional)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Aquí puedes manejar errores globales, como expiración de tokens
    if (error.response && error.response.status === 401) {
      // Por ejemplo, redirigir al login
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

export default api;