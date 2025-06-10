<!-- src/App.vue -->
<template>
  <v-app>
    <!-- サイドバー：ログイン済みかつログイン・登録画面でない場合に表示 -->
    <v-navigation-drawer v-if="!isAuthPage && isLoggedIn" app permanent class="custom-drawer">
      <v-list nav dense>
        <RouterLink to="/" class="nav-link">
          <v-list-item prepend-icon="mdi-home" title="ホーム" class="text-gold" />
        </RouterLink>
        <RouterLink to="/notes/create" class="nav-link">
          <v-list-item prepend-icon="mdi-plus-box" title="ノートを作成" class="text-gold" />
        </RouterLink>
      </v-list>
    </v-navigation-drawer>

    <!-- アプリバー -->
    <v-app-bar app flat class="custom-app-bar">
      <v-toolbar-title>
        <RouterLink to="/" class="title-link text-gold">Notelog</RouterLink>
      </v-toolbar-title>

      <v-spacer></v-spacer>

      <template v-if="isLoggedIn">
        <div class="d-flex align-center mr-4">
          <span class="mr-3 text-gold">{{ username }} さん</span>
          <v-btn variant="outlined" class="text-gold border-gold" @click="handleLogout">
            ログアウト
          </v-btn>
        </div>
      </template>
      <template v-else>
        <v-btn variant="outlined" class="text-gold border-gold mr-2" to="/register">
          会員登録
        </v-btn>
        <v-btn variant="outlined" class="text-gold border-gold" to="/login">
          ログイン
        </v-btn>
      </template>
    </v-app-bar>

    <!-- メイン -->
    <v-main>
      <v-container class="py-4">
        <router-view />
      </v-container>
    </v-main>
  </v-app>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'

const route = useRoute()
const router = useRouter()
const { isLoggedIn, username, logout } = useAuth()

const isAuthPage = computed(() => {
  return route.path === '/login' || route.path === '/register'
})

const handleLogout = () => {
  logout()
  router.push('/login')
}
</script>

<style scoped>
.custom-app-bar {
  background-color: #000 !important;
}

.custom-drawer {
  background-color: #000 !important;
  border-right: 1px solid #FFD70033;
}

.text-gold {
  color: #FFD700 !important;
}

.border-gold {
  border: 1px solid #FFD700 !important;
}

.title-link {
  text-decoration: none;
  font-weight: bold;
  font-size: 20px;
}

.nav-link {
  text-decoration: none;
  display: block;
}

.v-application {
  background-color: #121212 !important;
  color: #fff !important;
}
</style>
