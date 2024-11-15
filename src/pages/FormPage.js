// src/pages/FormPage.js
import React, { useState, useEffect, useContext } from 'react';
import api from '../services/api';
import { useNavigate, useParams } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

function FormPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    category: '',
    date: '',
  });
  const [categories, setCategories] = useState([]); // Suponiendo que las categorías vienen del backend
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { id } = useParams(); // Si hay un id, es una actualización
  const { auth } = useContext(AuthContext);

  useEffect(() => {
    fetchCategories();
    if (id) {
      fetchData(id);
    }
    // eslint-disable-next-line
  }, [id]);

  const fetchCategories = async () => {
    try {
      const response = await api.get('/categories'); // Ajusta según tu backend
      setCategories(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchData = async (id) => {
    try {
      const response = await api.get(`/data/${id}`);
      setFormData({
        name: response.data.name,
        email: response.data.email,
        category: response.data.category,
        date: response.data.date.split('T')[0], // Formatear fecha si es necesario
      });
    } catch (err) {
      console.error(err);
      setError('Error al cargar el registro.');
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    const { name, email, category, date } = formData;
    if (!name || !email || !category || !date) {
      setError('Todos los campos son obligatorios.');
      return false;
    }
    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Formato de email inválido.');
      return false;
    }
    // Validar fecha
    if (isNaN(new Date(date).getTime())) {
      setError('Fecha inválida.');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    if (!validateForm()) return;

    try {
      if (id) {
        // Actualizar registro existente
        await api.put(`/data/${id}`, formData);
        alert('Registro actualizado con éxito.');
      } else {
        // Crear nuevo registro
        await api.post('/data', formData);
        alert('Registro creado con éxito.');
      }
      navigate('/list');
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message || 'Error al guardar el registro. Inténtalo de nuevo.'
      );
    }
  };

  return (
    <div>
      <h2>{id ? 'Actualizar Registro' : 'Crear Nuevo Registro'}</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Nombre"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <select name="category" value={formData.category} onChange={handleChange} required>
          <option value="">Selecciona una categoría</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.name}>
              {cat.name}
            </option>
          ))}
        </select>
        <input
          type="date"
          name="date"
          placeholder="Fecha"
          value={formData.date}
          onChange={handleChange}
          required
        />
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button type="submit">{id ? 'Actualizar' : 'Guardar'}</button>
      </form>
    </div>
  );
}

export default FormPage;
