import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify'
import { loadFonts } from './plugins/webfontloader'
import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.css' // アイコン用

loadFonts()

createApp(App).use(router).use(vuetify).mount('#app')
