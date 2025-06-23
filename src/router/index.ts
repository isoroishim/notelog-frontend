// notelog-frontend/src/router/index.ts
import {
  createRouter,
  createWebHistory,
  type RouteRecordRaw,
} from 'vue-router';

import HomeView from '@/views/HomeView.vue';
import LoginView from '@/views/LoginView.vue';
import RegisterView from '@/views/RegisterView.vue';
import NoteCreateView from '@/views/NoteCreateView.vue';
import GoogleCallback from '@/views/GoogleCallback.vue';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
    meta: { requiresAuth: true },
  },
  {
    path: '/notes/create',
    name: 'note-create',
    component: NoteCreateView,
    meta: { requiresAuth: true },
  },
  {
    path: '/login',
    name: 'login',
    component: LoginView,
    meta: { guest: true },
  },
  {
    path: '/register',
    name: 'register',
    component: RegisterView,
    meta: { guest: true },
  },
  {
    path: '/auth/callback',
    name: 'google-callback',
    component: GoogleCallback,
    meta: {
      requiresAuth: false, // 認証不要
      guest: false, // ゲスト専用でもない
      public: true, // パブリックアクセス可能
    },
  },
  // 404ページ
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    redirect: '/',
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

// 認証ガード（改良版）
router.beforeEach((to, from, next) => {
  const accessToken = localStorage.getItem('access_token');
  const isAuthenticated = !!accessToken;

  // パブリックページ（認証状態に関係なくアクセス可能）
  if (to.matched.some((record) => record.meta.public)) {
    next();
    return;
  }

  // 認証が必要なページへのアクセス
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (!isAuthenticated) {
      // ログインページにリダイレクト（元のページ情報を保持）
      next({
        name: 'login',
        query: { redirect: to.fullPath },
      });
      return;
    }
  }

  // ゲスト専用ページ（ログイン済みユーザーはアクセス不可）
  if (to.matched.some((record) => record.meta.guest)) {
    if (isAuthenticated) {
      // クエリパラメータでリダイレクト先が指定されている場合はそこに、
      // なければホームページにリダイレクト
      const redirectPath = (to.query.redirect as string) || '/';
      next(redirectPath);
      return;
    }
  }

  next();
});

export default router;
