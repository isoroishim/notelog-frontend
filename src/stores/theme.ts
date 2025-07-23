// src/stores/theme.ts
import { defineStore } from 'pinia';

/**
 * テーマ設定用ストア
 * - `theme`: 現在のテーマ（light, dark, sepia, custom）
 * - `setTheme()`: テーマを切り替え、CSSとlocalStorageに反映
 * - `initializeTheme()`: 保存されたテーマを初期化時に適用
 */
export const useThemeStore = defineStore('theme', {
  // 状態: テーマ（初期値は localStorage または 'light'）
  state: () => ({
    theme: localStorage.getItem('theme') || 'light',
  }),

  actions: {
    /**
     * テーマを変更し、CSS属性とローカルストレージに保存
     * - `data-theme` 属性 → CSS のカスタムプロパティに対応
     * - Vuetify 側の反映は App.vue 側で useTheme().global.name を使用
     */
    setTheme(newTheme: string) {
      this.theme = newTheme;
      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('theme', newTheme);
    },

    /**
     * 保存されたテーマを取得して適用（初期化用）
     */
    initializeTheme() {
      const saved = localStorage.getItem('theme') || 'light';
      this.setTheme(saved);
    },
  },
});
