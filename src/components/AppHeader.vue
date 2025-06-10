<template>
  <v-app>
    <!-- ナビゲーションドロワー（左側） -->
    <v-navigation-drawer app dark permanent class="custom-drawer">
      <v-list nav dense>
        <v-list-item to="/" title="ホーム" prepend-icon="mdi-home" class="text-gold" />
        <v-list-item to="/notes/create" title="ノートを作成" prepend-icon="mdi-plus-box" class="text-gold" />
      </v-list>
    </v-navigation-drawer>

    <!-- 上部アプリバー -->
    <v-app-bar app flat class="custom-app-bar">
      <v-toolbar-title>
        <RouterLink to="/" class="title-link text-gold">Notelog</RouterLink>
      </v-toolbar-title>

      <v-spacer></v-spacer>

      <v-btn variant="outlined" class="text-gold border-gold mr-2" to="/register">
        会員登録
      </v-btn>
      <v-btn variant="outlined" class="text-gold border-gold" to="/login">
        ログイン
      </v-btn>
    </v-app-bar>

    <!-- メインコンテンツ -->
    <v-main>
      <v-container class="py-4">
        <router-view />
      </v-container>
    </v-main>
  </v-app>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { RouterLink } from 'vue-router'

export default defineComponent({
  name: 'AppHeader',
  components: { RouterLink },
})
</script>

<style scoped>
.custom-app-bar {
  background-color: #000000 !important;
}

.custom-drawer {
  background-color: #000000 !important;
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

.v-application {
  background-color: #121212 !important;
  color: #fff !important;
}
</style>
