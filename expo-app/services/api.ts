import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';

const PROD_API_URL = 'https://easy-go-academy-web.vercel.app/api';

const getDevHost = () => {
  // Expo Go expone la IP del host de Metro en debuggerHost / hostUri
  const hostUri =
    Constants.expoConfig?.hostUri ||
    (Constants as any).manifest?.debuggerHost ||
    '';
  const host = hostUri.split(':')[0];
  return host ? `http://${host}:3001/api` : PROD_API_URL;
};

const API_URL = __DEV__ ? getDevHost() : PROD_API_URL;

console.log('📡 Mobile API URL:', API_URL);

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar token a las peticiones
api.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (e) {
      console.error('Error al obtener el token:', e);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
