<template>
  <v-container class="py-4">
    <v-card v-if="note" class="pa-4">
      <v-card-title class="text-h5">{{ note.title }}</v-card-title>
      <v-card-text class="text-body-1" style="white-space: pre-line">{{
        note.content
      }}</v-card-text>
      <v-card-actions>
        <v-btn variant="tonal" color="primary" @click="goBack">戻る</v-btn>
      </v-card-actions>
    </v-card>
    <div v-else>ノートが見つかりません。</div>
  </v-container>
</template>

<script lang="ts" setup>
  import { ref, onMounted } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import axios from 'axios';

  const route = useRoute();
  const router = useRouter();
  const note = ref<{ id: number; title: string; content: string } | null>(null);

  onMounted(async () => {
    try {
      const noteId = route.params.id;
      const response = await axios.get(
        `http://127.0.0.1:8000/api/notes/${noteId}/`,
      );
      note.value = response.data;
    } catch (error) {
      console.error('取得失敗:', error);
    }
  });

  const goBack = () => {
    router.push('/');
  };
</script>
