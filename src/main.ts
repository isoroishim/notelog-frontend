// src/main.ts

import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import vuetify from './plugins/vuetify';
import { loadFonts } from './plugins/webfontloader';
import { createPinia } from 'pinia';

import 'vuetify/styles'; // Vuetify の基本スタイル
import '@mdi/font/css/materialdesignicons.css'; // Material Design Icons
import '@/assets/styles/index.css'; // グローバル CSS（テーマ・ユーティリティなど）

// フォントを読み込み
loadFonts();

// Vue アプリケーションの初期化
const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.use(router);
app.use(vuetify);

// Pinia を app に登録後にストアを使用
import { useThemeStore } from '@/stores/theme';
const themeStore = useThemeStore();
themeStore.initializeTheme();

// アプリをマウント
app.mount('#app');
