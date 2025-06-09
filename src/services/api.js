import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = "https://stpericial-back-end.onrender.com"; // Troque para sua URL real

const api = axios.create({
  baseURL: API_URL,
});

// Interceptor para adicionar o token JWT em todas as requisições
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
