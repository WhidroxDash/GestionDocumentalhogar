// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import ListPage from './pages/ListPage';
import FormPage from './pages/FormPage';
import UnauthorizedPage from './pages/UnauthorizedPage';
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route
          path="/list"
          element={
            <PrivateRoute roles={['admin', 'user']}>
              <ListPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/form"
          element={
            <PrivateRoute roles={['admin']}>
              <FormPage />
            </PrivateRoute>
          }
        />
        <Route path="/unauthorized" element={<UnauthorizedPage />} />
        {/* Agrega más rutas protegidas según sea necesario */}
      </Routes>
    </Router>
  );
}

export default App;
const express = require('express');
const cors = require('cors');

const app = express();

// Configurar CORS
app.use(cors({
  origin: 'https://gsdocumentalhogar.somee.com/SergioPC',
  credentials: true,
}));
