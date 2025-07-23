<template>
  <!-- テーマ選択ダイアログ -->
  <v-dialog v-model="visible" max-width="400" persistent>
    <v-card>
      <!-- タイトル -->
      <v-card-title class="text-h6">テーマ設定</v-card-title>

      <!-- セレクトボックス -->
      <v-card-text>
        <v-select
          :items="themes"
          v-model="themeStore.theme"
          label="テーマを選択"
          variant="outlined"
          density="compact"
          @update:modelValue="themeStore.setTheme"
        />
      </v-card-text>

      <!-- フッター操作 -->
      <v-card-actions>
        <v-spacer />
        <v-btn color="primary" variant="text" @click="visible = false">
          閉じる
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
  import { computed } from 'vue';
  import { defineProps, defineEmits } from 'vue';
  import { useThemeStore } from '@/stores/theme';

  // テーマ選択肢
  const themes = [
    'light',
    'dark',
    'sepia',
    'greenlight',
    'greendark',
    'bluelight',
    'bluedark',
  ];

  // ピニアのテーマストア
  const themeStore = useThemeStore();

  // 親コンポーネントから受け取る表示状態
  const props = defineProps<{
    visible: boolean;
  }>();

  // 表示状態の更新イベント
  const emit = defineEmits<{
    (e: 'update:visible', value: boolean): void;
  }>();

  // v-model との双方向バインディングをcomputedで橋渡し
  const visible = computed({
    get: () => props.visible,
    set: (val: boolean) => emit('update:visible', val),
  });
</script>
