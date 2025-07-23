<template>
  <v-app>
    <!-- テーマ反映（data-theme によりCSS変数が適用される）-->
    <div :data-theme="themeStore.theme" class="app-wrapper">
      <AppHeader />
      <AppSidebar v-if="!isAuthPage && isLoggedIn" />
      <v-main>
        <v-container class="py-4">
          <router-view />
        </v-container>
      </v-main>
    </div>
  </v-app>
</template>

<script setup lang="ts">
  import { computed, watchEffect } from 'vue';
  import { useRoute } from 'vue-router';
  import { useAuth } from '@/composables/useAuth';
  import { useThemeStore } from '@/stores/theme';
  import { useTheme as useVuetifyTheme } from 'vuetify';

  import AppHeader from '@/components/AppHeader.vue';
  import AppSidebar from '@/components/AppSidebar.vue';

  const route = useRoute();
  const { isLoggedIn } = useAuth();
  const themeStore = useThemeStore();

  // 認証ページ判定
  const isAuthPage = computed(() =>
    ['/login', '/register'].includes(route.path),
  );

  // Vuetifyテーマに反映（.text-primary などに影響する）
  const vuetifyTheme = useVuetifyTheme();
  watchEffect(() => {
    vuetifyTheme.global.name.value = themeStore.theme;
  });
</script>
