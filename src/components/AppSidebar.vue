<template>
  <!-- ログイン済みの場合のみ表示されるサイドバー -->
  <v-navigation-drawer v-if="isLoggedIn" app permanent class="custom-drawer">
    <v-list nav dense>
      <!-- ホームへのリンク -->
      <RouterLink to="/" class="nav-link">
        <v-list-item
          prepend-icon="mdi-home"
          title="ホーム"
          class="accent-color"
        />
      </RouterLink>

      <!-- ノート作成画面へのリンク -->
      <RouterLink to="/notes/create" class="nav-link">
        <v-list-item
          prepend-icon="mdi-plus-box"
          title="ノートを作成"
          class="accent-color"
        />
      </RouterLink>
    </v-list>
  </v-navigation-drawer>
</template>

<script setup lang="ts">
  // 認証状態取得（ログイン判定）
  import { useAuth } from '@/composables/useAuth';
  import { RouterLink } from 'vue-router';

  const { isLoggedIn } = useAuth();
</script>
