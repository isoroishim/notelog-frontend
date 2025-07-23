<template>
  <v-container class="fill-height d-flex align-center justify-center">
    <v-card class="pa-6" width="420" elevation="8" rounded="lg">
      <!-- ロゴ・説明 -->
      <div class="text-center mb-5">
        <h1 class="text-h4 font-weight-bold mb-2 text-primary">Notelog</h1>
        <p class="text-subtitle-1 text-primary-emphasis">
          ナレッジ管理プラットフォーム
        </p>
      </div>

      <!-- タイトル -->
      <v-card-title class="text-h5 text-center mb-2">ログイン</v-card-title>

      <!-- ログインフォーム -->
      <v-form @submit.prevent="handleLogin">
        <v-card-text>
          <!-- メール入力 -->
          <v-text-field
            v-model="email"
            label="メールアドレス"
            type="email"
            variant="outlined"
            prepend-inner-icon="mdi-email-outline"
          />

          <!-- パスワード入力 -->
          <v-text-field
            v-model="password"
            :type="showPassword ? 'text' : 'password'"
            label="パスワード"
            variant="outlined"
            prepend-inner-icon="mdi-lock-outline"
            :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
            @click:append-inner="showPassword = !showPassword"
          />
        </v-card-text>

        <!-- ボタン・リンク -->
        <v-card-actions class="px-6 pb-6">
          <div class="w-100">
            <!-- ログインボタン -->
            <v-btn
              color="primary"
              size="large"
              block
              type="submit"
              :loading="loading"
              class="mb-4"
              rounded="lg"
            >
              <v-icon left>mdi-login</v-icon>
              <span class="font-weight-bold ml-2">ログイン</span>
            </v-btn>

            <!-- 区切り線 -->
            <hr class="divider" />

            <!-- Google ログインボタン -->
            <GoogleLoginButton
              :loading="googleLoading"
              @click="handleGoogleLogin"
            />

            <!-- 登録リンク -->
            <div class="text-center mt-6">
              <span class="text-body-2 text-medium-emphasis">
                アカウントをお持ちでない方は
              </span>
              <v-btn
                variant="text"
                color="primary"
                size="small"
                class="ml-1"
                @click="router.push('/register')"
              >
                新規登録はこちら
              </v-btn>
            </div>
          </div>
        </v-card-actions>
      </v-form>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
  import { ref } from 'vue';
  import { useRouter } from 'vue-router';
  import axios from '@/plugins/axios';
  import { useAuth } from '@/composables/useAuth';
  import { AxiosError } from 'axios';
  import GoogleLoginButton from '@/components/GoogleLoginButton.vue';

  // 状態管理
  const email = ref('');
  const password = ref('');
  const showPassword = ref(false);
  const loading = ref(false);
  const googleLoading = ref(false);

  const router = useRouter();
  const { login } = useAuth();

  // 通常ログイン処理
  const handleLogin = async () => {
    loading.value = true;
    try {
      const res = await axios.post('/api/auth/login/', {
        email: email.value,
        password: password.value,
      });

      const { access, refresh, name } = res.data;
      login(access, refresh, name || email.value);
      router.push('/');
    } catch (err) {
      const error = err as AxiosError;
      console.error('ログイン失敗:', error);
      alert('ログインに失敗しました');
    } finally {
      loading.value = false;
    }
  };

  // Googleログイン処理
  const handleGoogleLogin = () => {
    googleLoading.value = true;

    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

    if (!clientId) {
      alert('Google認証の設定が必要です');
      googleLoading.value = false;
      return;
    }

    const redirectUri = encodeURIComponent(
      'http://localhost:5173/auth/callback',
    );
    const scope = encodeURIComponent('openid email profile');

    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}&access_type=online&prompt=consent`;

    // ポップアップ位置の計算
    const width = 520;
    const height = 650;
    const left = Math.round(window.screen.width / 2 - width / 2);
    const top = Math.round(window.screen.height / 2 - height / 2);

    const popup = window.open(
      authUrl,
      'googleLogin',
      `width=${width},height=${height},left=${left},top=${top},scrollbars=yes,resizable=yes`,
    );

    if (!popup) {
      alert('ポップアップがブロックされました');
      googleLoading.value = false;
      return;
    }

    // ポップアップ監視用
    const checkClosed = setInterval(() => {
      if (popup.closed) {
        clearInterval(checkClosed);
        googleLoading.value = false;
      }
    }, 1000);

    // メッセージ受信
    const messageListener = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;

      if (event.data.type === 'GOOGLE_AUTH_SUCCESS') {
        const { access, refresh, name } = event.data;
        login(access, refresh, name);
        router.push('/');
        popup.close();
      } else if (event.data.type === 'GOOGLE_AUTH_ERROR') {
        alert('Google認証に失敗しました');
        popup.close();
      }

      // 後始末
      window.removeEventListener('message', messageListener);
      clearInterval(checkClosed);
      googleLoading.value = false;
    };

    window.addEventListener('message', messageListener);

    // タイムアウト処理（5分）
    setTimeout(() => {
      if (!popup.closed) popup.close();
      window.removeEventListener('message', messageListener);
      clearInterval(checkClosed);
      googleLoading.value = false;
    }, 300_000);
  };
</script>
