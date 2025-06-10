// src/router/index.ts
import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import LoginView from '@/views/LoginView.vue'
import RegisterView from '@/views/RegisterView.vue'
import NoteCreateView from '@/views/NoteCreateView.vue'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
    meta: { requiresAuth: true }, // 🔒 ログイン必須
  },
  {
    path: '/notes/create',
    name: 'note-create',
    component: NoteCreateView,
    meta: { requiresAuth: true }, // 🔒 ログイン必須
  },
  {
    path: '/login',
    name: 'login',
    component: LoginView,
  },
  {
    path: '/register',
    name: 'register',
    component: RegisterView,
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

// グローバルガード：未ログインなら /login にリダイレクト
router.beforeEach((to, from, next) => {
  const accessToken = localStorage.getItem('access_token')
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)

  if (requiresAuth && !accessToken) {
    next('/login')
  } else {
    next()
  }
})

export default router
