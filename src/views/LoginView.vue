<template>
  <v-container class="fill-height d-flex align-center justify-center">
    <v-card width="400" class="pa-6">
      <v-card-title class="text-h6">ログイン</v-card-title>
      <v-card-text>
        <v-form @submit.prevent="handleLogin" ref="formRef">
          <v-text-field v-model="email" label="メールアドレス" type="email" required />
          <v-text-field v-model="password" label="パスワード" type="password" required />
          <v-btn type="submit" color="primary" block>ログイン</v-btn>
        </v-form>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const email = ref('')
const password = ref('')
const formRef = ref()

const handleLogin = () => {
  console.log('ログイン試行:', email.value, password.value)
  // JWT API連携は後ほど
}
</script>
