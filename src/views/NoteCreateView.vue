<template>
  <v-container class="py-4">
    <v-row justify="center">
      <v-col cols="12" sm="10" md="8">
        <v-card class="pa-4">
          <v-card-title>ノートを作成</v-card-title>
          <v-card-text>
            <v-form @submit.prevent="handleSubmit">
              <v-text-field v-model="title" label="タイトル" required />
              <v-textarea
                v-model="content"
                label="内容"
                rows="8"
                auto-grow
                required
              />
              <v-btn type="submit" color="primary" class="mt-4">保存</v-btn>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  import axios from 'axios';
  import { useRouter } from 'vue-router';

  const title = ref('');
  const content = ref('');
  const router = useRouter();

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem('access');
      await axios.post(
        'http://127.0.0.1:8000/api/notes/',
        {
          title: title.value,
          content: content.value,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      router.push('/');
    } catch (error) {
      console.error('ノート作成失敗:', error);
      alert('ノートの作成に失敗しました。');
    }
  };
</script>
