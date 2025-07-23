<template>
  <v-container class="py-4 px-4 container-center">
    <h2 class="section-title">ノート一覧</h2>

    <!-- 検索バー -->
    <v-text-field
      v-model="searchQuery"
      prepend-inner-icon="mdi-magnify"
      placeholder="ノートを検索..."
      hide-details
      clearable
      class="mb-4"
      variant="solo"
    />

    <!-- 最近アクセスしたノート -->
    <div class="mb-4">
      <h3 class="section-subtitle mb-2">最近のアクセス</h3>

      <!-- 最近のノートがある場合 -->
      <v-list v-if="recentNotes.length > 0" class="pa-0">
        <v-list-item
          v-for="note in recentNotes"
          :key="'recent-' + note.id"
          class="note-item"
          @click="goToDetail(note.id)"
        >
          <v-list-item-content>
            <v-list-item-title class="note-title">
              {{ note.title }}
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>

      <!-- 最近のノートがない場合 -->
      <div v-else class="d-flex justify-start">
        <v-card
          class="new-page-card d-flex flex-column align-center justify-center"
          width="120"
          height="120"
          @click="goToCreate"
        >
          <v-icon size="28" class="mb-2 icon-muted">mdi-plus</v-icon>
          <span class="text-muted text-center" style="font-size: 0.9rem">
            新規ページ
          </span>
        </v-card>
      </div>
    </div>

    <!-- ローディングインジケーター -->
    <v-progress-circular
      v-if="loading"
      indeterminate
      color="primary"
      class="mx-auto"
    />

    <!-- ノート一覧（フィルタ済） -->
    <v-list v-else class="pa-0">
      <v-list-item
        v-for="note in filteredNotes"
        :key="note.id"
        class="note-item"
        @click="goToDetail(note.id)"
      >
        <v-list-item-content>
          <v-list-item-title class="note-title">
            {{ note.title }}
          </v-list-item-title>
          <v-list-item-subtitle class="note-content">
            {{ note.content }}
          </v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
    </v-list>

    <!-- フィルタ結果が0件のとき -->
    <div
      v-if="!loading && filteredNotes.length === 0"
      class="text-muted mt-4 text-center"
    >
      該当するノートは見つかりませんでした。
    </div>
  </v-container>
</template>

<script setup lang="ts">
  import { ref, computed, onMounted } from 'vue';
  import { useRouter } from 'vue-router';
  import axios from '@/plugins/axios';

  // ノート型の定義
  interface Note {
    id: number;
    title: string;
    content: string;
  }

  // ステート定義
  const notes = ref<Note[]>([]); // 全ノート一覧
  const recentNotes = ref<Note[]>([]); // 最近アクセスしたノート
  const searchQuery = ref(''); // 検索キーワード
  const loading = ref(true); // 読み込み中フラグ
  const router = useRouter();

  // ノート一覧を取得（API呼び出し）
  const fetchNotes = async () => {
    try {
      const res = await axios.get('/notes/');
      notes.value = res.data;
    } catch (err) {
      console.error('ノート取得失敗:', err);
    } finally {
      loading.value = false;
    }
  };

  // 検索ワードでノートをフィルタ
  const filteredNotes = computed(() =>
    notes.value.filter((note) =>
      [note.title, note.content]
        .join(' ')
        .toLowerCase()
        .includes(searchQuery.value.toLowerCase()),
    ),
  );

  // 最近アクセスしたノートの最大件数
  const MAX_RECENT = 5;

  // ローカルストレージから最近のノートを読み込み
  const loadRecentNotes = () => {
    const saved = JSON.parse(localStorage.getItem('recentNotes') || '[]');
    recentNotes.value = saved;
  };

  // ノート詳細へ遷移 ＋ 最近アクセスに追加
  const goToDetail = (id: number) => {
    const note = notes.value.find((n) => n.id === id);
    if (note) addToRecent(note);
    router.push(`/notes/${id}`);
  };

  // ノート作成画面へ遷移
  const goToCreate = () => {
    router.push('/notes/create');
  };

  // 最近アクセスにノートを追加（重複除去・最大件数制限）
  const addToRecent = (note: Note) => {
    const recent = JSON.parse(
      localStorage.getItem('recentNotes') || '[]',
    ) as Note[];

    const updated = [note, ...recent.filter((n) => n.id !== note.id)].slice(
      0,
      MAX_RECENT,
    );

    localStorage.setItem('recentNotes', JSON.stringify(updated));
    recentNotes.value = updated;
  };

  // 初期化処理（ノート取得と最近の読み込み）
  onMounted(() => {
    fetchNotes();
    loadRecentNotes();
  });
</script>
