<template>
  <!-- アプリケーションヘッダー（固定位置） -->
  <v-app-bar app flat class="custom-app-bar">
    <!-- アプリタイトル -->
    <v-toolbar-title>
      <RouterLink to="/" class="title-link">Notelog</RouterLink>
    </v-toolbar-title>

    <!-- スペーサー：右寄せのため -->
    <v-spacer />

    <!-- 設定ボタン（アイコンボタン） -->
    <v-btn
      icon
      class="accent-color"
      aria-label="設定"
      @click="showSettings = true"
    >
      <v-icon size="24">mdi-cog</v-icon>
    </v-btn>

    <!-- 認証状態に応じた表示 -->
    <template v-if="isLoggedIn">
      <!-- ログイン済み時：ユーザー名とログアウトボタン -->
      <div class="d-flex align-center ml-4">
        <span class="mr-3 accent-color">{{ username }} さん</span>
        <v-btn
          variant="outlined"
          class="accent-color border-accent"
          @click="handleLogout"
        >
          ログアウト
        </v-btn>
      </div>
    </template>

    <template v-else>
      <!-- 未ログイン時：会員登録・ログインボタン -->
      <v-btn
        variant="outlined"
        class="accent-color border-accent mr-2"
        to="/register"
      >
        会員登録
      </v-btn>
      <v-btn variant="outlined" class="accent-color border-accent" to="/login">
        ログイン
      </v-btn>
    </template>

    <!-- テーマ設定などのモーダルダイアログ -->
    <SettingsDialog v-model:visible="showSettings" />
  </v-app-bar>
</template>

<script setup lang="ts">
  // Vue / ルーティング / 認証状態管理 / 設定モーダルの読み込み
  import { ref } from 'vue';
  import { useRouter } from 'vue-router';
  import { useAuth } from '@/composables/useAuth';
  import SettingsDialog from '@/components/SettingsDialog.vue';

  // ルーター取得
  const router = useRouter();

  // 認証情報の取得（ログイン状態・ユーザー名・ログアウト関数）
  const { isLoggedIn, username, logout } = useAuth();

  // 設定ダイアログの表示状態
  const showSettings = ref(false);

  // ログアウト処理（完了後ログイン画面へ遷移）
  const handleLogout = () => {
    logout();
    router.push('/login');
  };
</script>
