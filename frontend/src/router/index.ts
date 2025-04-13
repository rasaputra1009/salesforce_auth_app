import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import Login from '../views/Login.vue';
import Register from '../views/Register.vue';
import Dashboard from '../views/Dashboard.vue';
import axios from 'axios';

const routes: RouteRecordRaw[] = [
  { path: '/', redirect: '/login' },
  { path: '/login', name: 'Login', component: Login },
  { path: '/register', name: 'Register', component: Register },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard,
    meta: { requiresAuth: true },
  },
  { path: '/:pathMatch(.*)*', redirect: '/login' },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach(async (to, from, next) => {
  const token = localStorage.getItem('token');
  console.log('Route guard triggered for path:', to.path, 'Token:', token);

  if (to.meta.requiresAuth && !token) {
    console.log('No token, redirecting to /login');
    next('/login');
    return;
  }

  if (to.meta.requiresAuth && token) {
    try {
      console.log('Validating token with /api/auth/verify');
      await axios.get(`${process.env.VUE_APP_API_URL}/api/auth/verify`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log('Token validated successfully');
      next();
    } catch (error: any) {
      console.error('Token validation failed:', error.response?.data || error.message);
      if (error.response?.status === 401 || error.response?.status === 403) {
        localStorage.removeItem('token');
        next('/login');
      } else {
        next();
      }
    }
  } else if ((to.path === '/login' || to.path === '/register') && token) {
    console.log('Redirecting to /dashboard due to existing token');
    next('/dashboard');
  } else {
    console.log('Proceeding to next route');
    next();
  }
});

export default router;