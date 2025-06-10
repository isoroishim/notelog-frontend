// 4. src/views/HomeView.vue
<template>
  <v-container class="py-4">
    <h2 class="text-gold mb-4">ノート一覧</h2>
    <v-row>
      <v-col cols="12" md="4" v-for="note in notes" :key="note.id">
        <v-card class="note-card" @click="goToDetail(note.id)">
          <v-card-title>{{ note.title }}</v-card-title>
          <v-card-text class="text-truncate">{{ note.content }}</v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts" setup>
  import { onMounted, ref } from 'vue';
  import { useRouter } from 'vue-router';
  import axios from '@/plugins/axios';

  interface Note {
    id: number;
    title: string;
    content: string;
  }

  const notes = ref<Note[]>([]);
  const router = useRouter();

  const fetchNotes = async () => {
    try {
      const res = await axios.get('/notes/');
      notes.value = res.data;
    } catch (err) {
      console.error('ノート取得失敗:', err);
    }
  };

  const goToDetail = (id: number) => {
    router.push(`/notes/${id}`);
  };

  onMounted(fetchNotes);
</script>

<style scoped>
  .text-gold {
    color: #ffd700 !important;
  }

  .note-card {
    cursor: pointer;
    transition: 0.3s;
  }

  .note-card:hover {
    background-color: #1a1a1a;
  }

  .text-truncate {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
</style>
