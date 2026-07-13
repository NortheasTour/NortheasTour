import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const routes = [
  { path: '/login', name: 'Login', component: () => import('../views/LoginView.vue') },
  { path: '/', name: 'Feed', component: () => import('../views/DashboardView.vue') },

  { 
    path: '/places/new', 
    name: 'CreatePlace', 
    component: () => import('../views/PlaceFormView.vue'),
    meta: { requiresAuth: true, role: 'GUIA' }
  },
  { 
    path: '/itinerary/new', 
    name: 'CreateItinerary', 
    component: () => import('../views/ItineraryFormView.vue'),
    meta: { requiresAuth: true, role: 'GUIA' }
  },

  { 
    path: '/places/:id', 
    name: 'PlaceDetails', 
    component: () => import('../views/DetailsView.vue'),
    meta: { requiresAuth: true }
  },
  
  { 
    path: '/admin/users', 
    name: 'UsersList', 
    component: () => import('../views/UsersListView.vue'),
    meta: { requiresAuth: true, role: 'GUIA' }
  },
  { 
    path: '/admin', 
    name: 'AdminPanel', 
    component: () => import('../views/AdminPanelView.vue'),
    meta: { requiresAuth: true, role: 'GUIA' }
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()

  // Se está tentando acessar página protegida sem login
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next('/login')
    return
  }

  // Se é guia e tenta acessar rota de guia
  if (to.meta.role === 'GUIA' && !authStore.isGuia) {
    next('/')
    return
  }

  // Se está logado e tenta ir para login
  if (to.path === '/login' && authStore.isAuthenticated) {
    next('/')
    return
  }

  next()
})

export default router