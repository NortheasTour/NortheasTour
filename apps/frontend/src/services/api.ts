import axios from 'axios';
import { useAuthStore } from '../stores/auth';

// Criação da instância baseada na variável de ambiente do Vite
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Flag e Fila para gerenciar múltiplos requests falhando simultaneamente (Refresh Token Flow)
let isRefreshing = false;
let failedQueue: Array<{ resolve: Function; reject: Function }> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Interceptor de Request: Injeta o Access Token
api.interceptors.request.use(
  (config) => {
    const authStore = useAuthStore();
    const token = authStore.accessToken;
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor de Response: Trata o erro 401 e dispara o Refresh Token
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise(function (resolve, reject) {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const authStore = useAuthStore();

      try {
        // Ajuste a chave 'refreshToken' para o nome exato que está no seu DTO de Refresh
        const { data } = await axios.post(`${api.defaults.baseURL}/token/refresh`, {
          refreshToken: authStore.refreshToken, // Verifique se o DTO não espera 'token' ou 'refresh_token'
        });

        authStore.setTokens(data.access_token, data.refresh_token);
        // Atualiza os headers para o retry e para futuras requisições
        api.defaults.headers.common['Authorization'] = `Bearer ${data.access_token}`;
        originalRequest.headers.Authorization = `Bearer ${data.access_token}`;

        processQueue(null, data.access_token);
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        // Se o refresh token falhar ou expirar, encerra a sessão
        authStore.logout();
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);