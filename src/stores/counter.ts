// stores/counter.ts
import { ref, computed } from 'vue';
import { defineStore } from 'pinia';

/**
 * カウンター用ストア
 * - `count`: 現在のカウント値
 * - `doubleCount`: その2倍の値（算出プロパティ）
 * - `increment()`: カウントを1増やす関数
 */
export const useCounterStore = defineStore('counter', () => {
  // 状態: カウント値（リアクティブ変数）
  const count = ref(0);

  // 算出プロパティ: count の2倍
  const doubleCount = computed(() => count.value * 2);

  // アクション: カウントを1増やす
  function increment() {
    count.value++;
  }

  // 外部に公開する状態とアクション
  return { count, doubleCount, increment };
});
