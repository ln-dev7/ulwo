import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/login',
    name: 'LoginView',
    component: () => import('../views/auth/LoginView.vue')
  },
  {
    path: '/register',
    name: 'RegisterView',
    component: () => import('../views/auth/RegisterView.vue')
  },
  {
    path: '/dashboard',
    name: 'DashboardView',
    component: () => import('../views/user/DashboardView.vue'),
  },
  {
    path: '/jobs',
    name: 'JobsView',
    component: () => import('../views/user/JobsView.vue'),
  },
  {
    path: '/job/:id',
    name: 'JobView',
    component: () => import('../views/user/JobView.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  linkActiveClass: 'active',
  linkExactActiveClass: 'exactActive'
})

export default router
