import { createVuetify } from 'vuetify';
import '@mdi/font/css/materialdesignicons.css';

export default defineNuxtPlugin((nuxtApp) => {
  const vuetify = createVuetify({
    theme: { defaultTheme: 'dark' },
  });

  nuxtApp.vueApp.use(vuetify);
});
