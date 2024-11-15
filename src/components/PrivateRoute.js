// src/components/PrivateRoute.js
import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const PrivateRoute = ({ children, roles }) => {
  const { auth } = useContext(AuthContext);

  if (!auth.token) {
    // No autenticado
    return <Navigate to="/" />;
  }

  if (roles && !roles.includes(auth.user.role)) {
    // No tiene el rol requerido
    return <Navigate to="/unauthorized" />;
  }

  return children;
};

export default PrivateRoute;
