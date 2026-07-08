import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'

import { useAuthStore, type UserRole } from '@/stores/auth'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: { name: 'home' },
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/Login.vue'),
    meta: { title: 'Autenticação' },
  },
  {
    path: '/home',
    name: 'home',
    component: () => import('@/views/Home.vue'),
    meta: { requiresAuth: true, title: 'Feed principal' },
  },
  {
    path: '/places/:id',
    name: 'place-details',
    component: () => import('@/views/PlaceDetails.vue'),
    meta: { requiresAuth: true, title: 'Detalhes do local' },
  },
  {
    path: '/itinerarios/novo',
    name: 'itinerary-form',
    component: () => import('@/views/ItineraryForm.vue'),
    meta: { requiresAuth: true, roles: ['TURISTA', 'ADMIN'], title: 'Criar roteiro' },
  },
  {
    path: '/admin/painel',
    name: 'admin-dashboard',
    component: () => import('@/views/AdminDashboard.vue'),
    meta: { requiresAuth: true, roles: ['ADMIN'], title: 'Painel administrativo' },
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: { name: 'home' },
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior() {
    return { top: 0 }
  },
})

router.beforeEach((to) => {
  const auth = useAuthStore()

  if (to.name === 'login' && auth.isAuthenticated) {
    return auth.isAdmin ? { name: 'admin-dashboard' } : { name: 'home' }
  }

  if (to.meta.requiresAuth && !auth.isAuthenticated) {
    return { name: 'login', query: { redirect: to.fullPath } }
  }

  const allowedRoles = to.meta.roles as UserRole[] | undefined
  if (allowedRoles?.length && (!auth.role || !allowedRoles.includes(auth.role))) {
    return auth.isAdmin ? { name: 'admin-dashboard' } : { name: 'home' }
  }

  return true
})

router.afterEach((to) => {
  document.title = `NortheasTour${to.meta.title ? ` | ${to.meta.title}` : ''}`
})

export default router
