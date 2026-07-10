import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const routes = [
  { path: '/login', name: 'Login', component: () => import('../views/LoginView.vue') },
  { path: '/', name: 'Feed', component: () => import('../views/DashboardView.vue') },
  { 
    path: '/places/new', 
    name: 'CreatePlace', 
    component: () => import('../views/PlaceFormView.vue'),
    meta: { requiresAuth: true, role: 'ADMIN' } 
  },
  { 
    path: '/places/:id', 
    name: 'PlaceDetails', 
    component: () => import('../views/DetailsView.vue') 
  },
  { 
    path: '/itinerary/new', 
    name: 'CreateItinerary', 
    component: () => import('../views/ItineraryFormView.vue'),
    meta: { requiresAuth: true, role: 'TURISTA' } 
  },
  { 
    path: '/admin', 
    name: 'AdminPanel', 
    component: () => import('../views/AdminPanelView.vue'),
    meta: { requiresAuth: true, role: 'ADMIN' } 
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  const requiresAuth = to.meta.requiresAuth
  const requiredRole = to.meta.role

  if (requiresAuth && !authStore.isAuthenticated) {
    next('/login')
  } else if (requiredRole && authStore.role !== requiredRole) {
    next('/') // Redireciona se não tiver permissão
  } else {
    next()
  }
})

export default router