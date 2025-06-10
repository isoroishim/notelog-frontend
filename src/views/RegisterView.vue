<template>
  <v-container class="fill-height d-flex align-center justify-center">
    <v-card class="pa-6" width="400">
      <v-card-title class="text-h5">新規会員登録</v-card-title>
      <v-form @submit.prevent="register">
        <v-card-text>
          <v-text-field
            v-model="name"
            label="ユーザー名"
            type="text"
            name="name"
            autocomplete="username"
            required
          />
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
            name="new-password"
            autocomplete="new-password"
            :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
            @click:append-inner="showPassword = !showPassword"
            required
          />
          <v-text-field
            v-model="password2"
            :type="showPassword2 ? 'text' : 'password'"
            label="パスワード（確認）"
            name="confirm-password"
            autocomplete="new-password"
            :append-inner-icon="showPassword2 ? 'mdi-eye-off' : 'mdi-eye'"
            @click:append-inner="showPassword2 = !showPassword2"
            required
          />
        </v-card-text>
        <v-card-actions>
          <v-btn color="primary" block type="submit">登録する</v-btn>
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

  const name = ref('');
  const email = ref('');
  const password = ref('');
  const password2 = ref('');
  const showPassword = ref(false);
  const showPassword2 = ref(false);

  const router = useRouter();
  const { login } = useAuth();

  const register = async () => {
    if (password.value !== password2.value) {
      alert('パスワードが一致しません');
      return;
    }

    try {
      await axios.post('/auth/register/', {
        name: name.value,
        email: email.value,
        password: password.value,
      });

      const res = await axios.post('/auth/login/', {
        email: email.value,
        password: password.value,
      });

      login(res.data.access, res.data.refresh, res.data.username);
      router.push('/');
    } catch (err) {
      const error = err as AxiosError;
      const detail = error.response?.data;
      console.error('登録エラー:', detail);

      alert(
        '登録に失敗しました：' +
          (typeof detail === 'object'
            ? Object.values(detail as Record<string, string[]>)
                .flat()
                .join(', ')
            : '不明なエラー'),
      );
    }
  };
</script>
