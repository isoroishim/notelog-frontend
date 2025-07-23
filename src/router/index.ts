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

// 各ページのルーティング定義
const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
    meta: { requiresAuth: true }, // 認証必須
  },
  {
    path: '/notes/create',
    name: 'note-create',
    component: NoteCreateView,
    meta: { requiresAuth: true }, // 認証必須
  },
  {
    path: '/login',
    name: 'login',
    component: LoginView,
    meta: { guest: true }, // ゲスト専用（ログイン済はアクセス不可）
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
      guest: false,
      public: true, // 完全公開ページ
    },
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    redirect: '/', // 未定義パスはトップへリダイレクト
  },
];

// ルーター生成
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

// グローバルナビゲーションガード（認証制御）
router.beforeEach((to, from, next) => {
  const accessToken = localStorage.getItem('access_token');
  const isAuthenticated = !!accessToken;

  // パブリックページはそのまま通す
  if (to.matched.some((record) => record.meta.public)) {
    next();
    return;
  }

  // 認証が必要なページで未ログイン → ログイン画面へ
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (!isAuthenticated) {
      next({
        name: 'login',
        query: { redirect: to.fullPath },
      });
      return;
    }
  }

  // ゲスト専用ページでログイン済み → ホームなどへリダイレクト
  if (to.matched.some((record) => record.meta.guest)) {
    if (isAuthenticated) {
      const redirectPath = (to.query.redirect as string) || '/';
      next(redirectPath);
      return;
    }
  }

  // 上記に該当しない場合は通常遷移
  next();
});

export default router;
