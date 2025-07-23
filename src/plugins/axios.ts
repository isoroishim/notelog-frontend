import axios from 'axios';

// Axiosインスタンスを作成（共通設定）
const instance = axios.create({
  baseURL: 'http://127.0.0.1:8000', // バックエンドAPIのベースURL
  timeout: 5000, // タイムアウト（ms）
  headers: {
    'Content-Type': 'application/json',
  },
});

// 認証が不要なエンドポイント一覧（ログイン・登録など）
const noAuthPaths = [
  '/api/auth/login/',
  '/api/auth/register/',
  '/api/auth/google/token/',
];

// リクエスト前の共通処理（トークン付与）
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');

    // 認証トークンが存在し、かつ対象URLが認証不要でない場合のみ付与
    if (token && config.headers && !noAuthPaths.includes(config.url || '')) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error), // エラーはそのまま投げる
);

export default instance;
