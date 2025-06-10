// src/composables/useAuth.ts
import { ref, watchEffect } from 'vue'

const accessTokenKey = 'access_token'
const refreshTokenKey = 'refresh_token'
const usernameKey = 'username'

const isLoggedIn = ref<boolean>(!!localStorage.getItem(accessTokenKey))
const username = ref<string | null>(localStorage.getItem(usernameKey))

export const useAuth = () => {
  const login = (access: string, refresh: string, name: string) => {
    localStorage.setItem(accessTokenKey, access)
    localStorage.setItem(refreshTokenKey, refresh)
    localStorage.setItem(usernameKey, name)
    isLoggedIn.value = true
    username.value = name
  }

  const logout = () => {
    localStorage.removeItem(accessTokenKey)
    localStorage.removeItem(refreshTokenKey)
    localStorage.removeItem(usernameKey)
    isLoggedIn.value = false
    username.value = null
  }

  const getAccessToken = () => localStorage.getItem(accessTokenKey)

  watchEffect(() => {
    isLoggedIn.value = !!localStorage.getItem(accessTokenKey)
    username.value = localStorage.getItem(usernameKey)
  })

  return { isLoggedIn, username, login, logout, getAccessToken }
}
