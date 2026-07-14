import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import HomeView from '../views/HomeView.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'home', component: HomeView },
    { 
      path: '/places/:id', 
      name: 'place-details', 
      component: () => import('../views/PlaceDetailsView.vue') 
    },
    { 
      path: '/places/new', 
      name: 'place-new', 
      component: () => import('../views/PlaceFormView.vue'),
      meta: { requiresAuth: true, requiresGuia: true }
    },
    { 
      path: '/roteiros', 
      name: 'roteiros', 
      component: () => import('../views/RoteirosView.vue'),
      meta: { requiresAuth: true }
    },
    { 
      path: '/roteiros/new', 
      name: 'roteiros-new', 
      component: () => import('../views/RoteiroFormView.vue'),
      meta: { requiresAuth: true }
    },
    { 
      path: '/roteiros/:id', 
      name: 'roteiro-details', 
      component: () => import('../views/RoteiroDetailsView.vue'),
      meta: { requiresAuth: true }
    },
        { 
      path: '/login', 
      name: 'login', 
      component: () => import('../views/LoginView.vue'),
      meta: { requiresAuth: false }
    }
  ],
});

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  const isAuthenticated = authStore.isAuthenticated;
  const isGuia = authStore.isGuia;

  if (to.meta.requiresAuth && !isAuthenticated) {
    next('/login');
  } else if (to.meta.requiresGuia && !isGuia) {
    next('/');
  } else {
    next();
  }
});

export default router;