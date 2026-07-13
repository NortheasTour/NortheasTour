import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { api } from '../services/api';
import { useRouter } from 'vue-router';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'USER' | 'GUIA'; // Sincronizado estritamente com o Prisma Enum
}

export const useAuthStore = defineStore('auth', () => {
  const router = useRouter();

  // Inicialização segura: Impede que o "undefined" no localStorage trave a app
  const user = ref<User | null>(() => {
    const storedUser = localStorage.getItem('user');
    try {
      if (storedUser && storedUser !== 'undefined' && storedUser !== 'null') {
        return JSON.parse(storedUser);
      }
    } catch (e) {
      localStorage.removeItem('user');
    }
    return null;
  });

  const accessToken = ref<string | null>(localStorage.getItem('access_token'));
  const refreshToken = ref<string | null>(localStorage.getItem('refresh_token'));

  const isAuthenticated = computed(() => !!accessToken.value);
  const role = computed(() => user.value?.role || null);

  const setTokens = (newAccess: string, newRefresh: string) => {
    accessToken.value = newAccess;
    refreshToken.value = newRefresh;
    localStorage.setItem('access_token', newAccess);
    localStorage.setItem('refresh_token', newRefresh);
  };

  const setUser = (newUser: User) => {
    user.value = newUser;
    localStorage.setItem('user', JSON.stringify(newUser));
  };

  const login = async (credentials: Record<string, string>) => {
    const response = await api.post('/auth/login', credentials);
    setTokens(response.data.access_token, response.data.refresh_token);
    setUser(response.data.user);
    router.push('/');
  };

  const register = async (userData: Record<string, string>) => {
    // Rota ajustada para o endpoint de cadastro
    const response = await api.post('/users/cadastrar', userData);
    
    // Autologin após cadastro bem-sucedido[cite: 1]
    if (!response.data.access_token) {
      await login({ email: userData.email, password: userData.password });
    } else {
      setTokens(response.data.access_token, response.data.refresh_token);
      setUser(response.data.user);
      router.push('/');
    }
  };

  const logout = () => {
    user.value = null;
    accessToken.value = null;
    refreshToken.value = null;
    localStorage.removeItem('user');
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    router.push('/login');
  };

  return { 
    user, 
    accessToken, 
    refreshToken, 
    isAuthenticated, 
    role, 
    login, 
    register, 
    logout, 
    setTokens 
  };
});