import { createRouter, createWebHistory } from 'vue-router'
import { supabase } from '@/lib/supabase.ts'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/login',
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue'), //lazy loading
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: () => import('../views/DashboardView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/tickets',
      name: 'tickets',
      component: () => import('../views/TicketsView.vue'),
      meta: { requiresAuth: true },
    },
  ],
})

//Navigation guard for logged out users
router.beforeEach(async (to) => {
  const {
    data: { session },
  } = await supabase.auth.getSession()

  // Redirect logged-out users from protected pages
  if (to.meta.requiresAuth && !session) {
    return '/login'
  }

  // Redirect logged-in users away from the login page
  if (to.name === 'login' && session) {
    return '/dashboard'
  }
})

export default router
