// src/pages/ListPage.js
import React, { useState, useEffect, useContext } from 'react';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';

function ListPage() {
  const [data, setData] = useState([]);
  const [filters, setFilters] = useState({
    keyword: '',
    startDate: '',
    endDate: '',
    category: '',
  });
  const [categories, setCategories] = useState([]); // Suponiendo que las categorías vienen del backend
  const { auth, logout } = useContext(AuthContext);

  useEffect(() => {
    fetchData();
    fetchCategories(); // Si las categorías se obtienen del backend
    // eslint-disable-next-line
  }, []);

  const fetchData = async () => {
    try {
      const response = await api.get('/data');
      setData(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await api.get('/categories'); // Ajusta según tu backend
      setCategories(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar este registro?')) {
      try {
        await api.delete(`/data/${id}`);
        setData(data.filter((item) => item.id !== id));
      } catch (err) {
        console.error(err);
        alert('Error al eliminar el registro.');
      }
    }
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const applyFilters = () => {
    // Implementar lógica para aplicar filtros. Podrías hacer una solicitud al backend con parámetros de consulta.
    // Aquí se muestra una filtración en el frontend como ejemplo.

    let filtered = [...data];

    if (filters.keyword) {
      filtered = filtered.filter((item) =>
        item.name.toLowerCase().includes(filters.keyword.toLowerCase())
      );
    }

    if (filters.startDate) {
      filtered = filtered.filter((item) => new Date(item.date) >= new Date(filters.startDate));
    }

    if (filters.endDate) {
      filtered = filtered.filter((item) => new Date(item.date) <= new Date(filters.endDate));
    }

    if (filters.category) {
      filtered = filtered.filter((item) => item.category === filters.category);
    }

    return filtered;
  };

  const handleLogout = () => {
    logout();
    window.location.href = '/';
  };

  return (
    <div>
      <h2>Listado</h2>
      <button onClick={handleLogout}>Cerrar Sesión</button>
      <div>
        <h3>Filtros</h3>
        <input
          type="text"
          name="keyword"
          placeholder="Buscar por palabra clave"
          value={filters.keyword}
          onChange={handleFilterChange}
        />
        <input
          type="date"
          name="startDate"
          placeholder="Fecha de inicio"
          value={filters.startDate}
          onChange={handleFilterChange}
        />
        <input
          type="date"
          name="endDate"
          placeholder="Fecha de fin"
          value={filters.endDate}
          onChange={handleFilterChange}
        />
        <select name="category" value={filters.category} onChange={handleFilterChange}>
          <option value="">Todas las categorías</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.name}>
              {cat.name}
            </option>
          ))}
        </select>
        <button onClick={() => setFilters({ keyword: '', startDate: '', endDate: '', category: '' })}>
          Limpiar Filtros
        </button>
      </div>
      <Link to="/form">Crear Nuevo Registro</Link>
      <ul>
        {applyFilters().map((item) => (
          <li key={item.id}>
            <strong>{item.name}</strong> - {item.email} - {item.category} - {item.date}
            {auth.user.role === 'admin' && (
              <>
                <Link to={`/form/${item.id}`}>Editar</Link>
                <button onClick={() => handleDelete(item.id)}>Eliminar</button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ListPage;
