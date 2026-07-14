import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';

export interface UserPayload {
  id: string;
  name: string;
  email: string;
  role: 'USER' | 'GUIA';
}

export const useAuthStore = defineStore('auth', () => {
  const router = useRouter();
  const accessToken = ref<string | null>(localStorage.getItem('access_token'));
  const refreshToken = ref<string | null>(localStorage.getItem('refresh_token'));

  const parseJwt = (token: string): UserPayload | null => {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (e) {
      return null;
    }
  };

  const user = computed<UserPayload | null>(() => {
    return accessToken.value ? parseJwt(accessToken.value) : null;
  });

  const isAuthenticated = computed(() => !!accessToken.value);
  const isGuia = computed(() => user.value?.role === 'GUIA');

  const setTokens = (access: string, refresh: string) => {
    accessToken.value = access;
    refreshToken.value = refresh;
    localStorage.setItem('access_token', access);
    localStorage.setItem('refresh_token', refresh);
  };

  const logout = () => {
    accessToken.value = null;
    refreshToken.value = null;
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    router.push('/');
  };

  return { accessToken, refreshToken, user, isAuthenticated, isGuia, setTokens, logout };
});