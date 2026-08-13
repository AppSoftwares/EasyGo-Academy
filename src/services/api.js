import axios from 'axios'

// Producción: cualquier dominio que NO sea localhost/IP local usa ruta relativa /api
const getBackendUrl = () => {
  const { hostname } = window.location;

  const isLocalNetwork =
    hostname === 'localhost' ||
    hostname === '127.0.0.1' ||
    /^(10\.|192\.168\.|172\.(1[6-9]|2\d|3[0-1])\.)/.test(hostname);

  if (!isLocalNetwork) {
    return '/api';
  }

  return import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
};

const API_URL = getBackendUrl();

console.log('📡 API URL configurada:', API_URL);

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Interceptor para agregar token a las peticiones
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Interceptor para manejar errores de autenticación
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('auth-storage')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default api
