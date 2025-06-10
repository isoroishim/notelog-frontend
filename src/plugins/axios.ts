// plugins/axios.ts
import axios from 'axios'

const instance = axios.create({
  baseURL: 'http://127.0.0.1:8000/api',
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  },
})

instance.interceptors.request.use(
  config => {
    const noAuthPaths = ['/auth/login/', '/auth/register/'] // 認証不要なパス
    const token = localStorage.getItem('access_token')

    if (token && config.headers && !noAuthPaths.includes(config.url || '')) {
      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  },
  error => Promise.reject(error)
)

export default instance
