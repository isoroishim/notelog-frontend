<template>
  <v-container class="fill-height d-flex align-center justify-center">
    <v-card class="pa-6" width="400">
      <v-card-title class="text-h5">ログイン</v-card-title>
      <v-form @submit.prevent="handleLogin">
        <v-card-text>
          <v-text-field
            v-model="email"
            label="メールアドレス"
            type="email"
            name="email"
            autocomplete="email"
            required
          />
          <v-text-field
            v-model="password"
            :type="showPassword ? 'text' : 'password'"
            label="パスワード"
            name="password"
            autocomplete="current-password"
            :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
            @click:append-inner="showPassword = !showPassword"
            required
          />
        </v-card-text>
        <v-card-actions class="d-flex flex-column gap-2">
          <v-btn color="primary" block type="submit">ログイン</v-btn>
          <v-btn
            color="primary"
            block
            variant="outlined"
            @click="handleGoogleLogin"
          >
            Googleでログイン
          </v-btn>
        </v-card-actions>
      </v-form>
    </v-card>
  </v-container>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  import { useRouter } from 'vue-router';
  import axios from '@/plugins/axios';
  import { useAuth } from '@/composables/useAuth';
  import { AxiosError } from 'axios';

  const email = ref('');
  const password = ref('');
  const showPassword = ref(false);
  const router = useRouter();
  const { login } = useAuth();

  const handleLogin = async () => {
    try {
      const res = await axios.post('/auth/login/', {
        email: email.value,
        password: password.value,
      });

      const { access, refresh, name } = res.data;
      login(access, refresh, name || email.value);
      router.push('/');
    } catch (err) {
      const error = err as AxiosError;
      const detail = error.response?.data;
      console.error('ログイン失敗:', detail);
      alert(
        'ログインに失敗しました：' +
          (typeof detail === 'object'
            ? Object.values(detail as Record<string, string[]>)
                .flat()
                .join(', ')
            : '不明なエラー'),
      );
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = 'http://127.0.0.1:8000/api/auth/google/';
  };
</script>
