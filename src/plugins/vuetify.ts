import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import { aliases, mdi } from 'vuetify/iconsets/mdi'
import { md3 } from 'vuetify/blueprints'

const vuetify = createVuetify({
  blueprint: md3,
  icons: {
    defaultSet: 'mdi',
    aliases,
    sets: { mdi },
  },
  theme: {
    defaultTheme: 'dark',
    themes: {
      dark: {
        dark: true,
        colors: {
          background: '#121212',
          surface: '#1f1f1f',
          primary: '#D4AF37', // 落ち着いた金
          secondary: '#B8860B', // ソフトな金茶
          onPrimary: '#000000',
          onSurface: '#E0E0E0',
          success: '#4CAF50',
          error: '#F44336',
          info: '#2196F3',
          warning: '#FFB300',
        },
      },
    },
  },
})

export default vuetify
