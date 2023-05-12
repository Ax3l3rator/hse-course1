// https://nuxt.com/docs/api/configuration/nuxt-config

import vuetify from 'vite-plugin-vuetify';

export default defineNuxtConfig({
  css: ['vuetify/styles'],
  vite: {
    ssr: {
      noExternal: ['vuetify'],
    },
  },
  modules: [
    'nuxt-electron',
    async (options, nuxt) => {
      nuxt.hooks.hook('vite:extendConfig', (config: any) =>
        config.plugins.push(vuetify())
      );
    },
    '@vueuse/nuxt',
    '@vee-validate/nuxt',
  ],
  electron: {
    include: ['electron'],
    outDir: 'dist-electron',
  },
  ssr: false,
  nitro: {
    routeRules: {
      '/*': { cors: true },
      '/': { prerender: true },
    },
  },
});
