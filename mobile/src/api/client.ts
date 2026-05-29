import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// ✅ Troque pelo IP da máquina onde a API roda
// Em produção: URL do servidor
export const BASE_URL = 'http://192.168.15.16:3333';

export const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

// ── Injetar token automaticamente ─────────────────────────────────────────────
api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('@smartclinica:token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ── Tratar erros globais ──────────────────────────────────────────────────────
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const msg =
      error.response?.data?.error ||
      error.message ||
      'Erro de conexão com o servidor';
    return Promise.reject(new Error(msg));
  }
);