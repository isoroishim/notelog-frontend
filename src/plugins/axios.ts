// plugins/axios.ts
import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://127.0.0.1:8000',
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  },
});

instance.interceptors.request.use(
  (config) => {
    const noAuthPaths = [
      '/api/auth/login/',
      '/api/auth/register/',
      '/api/auth/google/token/',
    ]; // 認証不要なパス
    const token = localStorage.getItem('access_token');

    if (token && config.headers && !noAuthPaths.includes(config.url || '')) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

export default instance;
