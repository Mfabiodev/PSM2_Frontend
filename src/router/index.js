import { createRouter, createWebHistory } from 'vue-router';
import { authService } from '@/services/authService.js';

// Import components
const Login = () => import('@/components/Login.vue');
const Dashboard = () => import('@/components/Dashboard.vue'); // Using the new Dashboard component

// Define routes
const routes = [
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: { requiresGuest: true } // Route for non-authenticated users only
  },
  {
    path: '/',
    name: 'Dashboard',
    component: Dashboard,
    meta: { requiresAuth: true } // Route requires authentication
  },
  {
    path: '/:pathMatch(.*)*', // Catch-all route for 404
    redirect: '/' // Redirect unknown routes to home
  }
];

// Create router instance
const router = createRouter({
  history: createWebHistory(),
  routes
});

// Navigation guard
router.beforeEach((to, from, next) => {
  const isAuthenticated = authService.isAuthenticated();

  if (to.meta.requiresAuth && !isAuthenticated) {
    // If route requires auth and user is not authenticated, redirect to login
    next('/login');
  } else if (to.meta.requiresGuest && isAuthenticated) {
    // If route is for guests only and user is authenticated, redirect to home
    next('/');
  } else {
    // Otherwise, proceed normally
    next();
  }
});

export default router;