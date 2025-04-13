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

  if (to.meta.requiresAuth && !token) {
    next('/login');
    return;
  }

  if (to.meta.requiresAuth && token) {
    try {
      await axios.get(`${process.env.VUE_APP_API_URL}/api/auth/verify`, {
        headers: { Authorization: `Bearer ${token}` },
      });
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
    next('/dashboard');
  } else {
    next();
  }
});

export default router;