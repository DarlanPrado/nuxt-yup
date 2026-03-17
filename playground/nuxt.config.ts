export default defineNuxtConfig({
  modules: ['../src/module'],
  devtools: {
    enabled: true,

    timeline: {
      enabled: true,
    },
  },
  runtimeConfig: {
    public: {
      yupExtMode: process.env.NUXT_YUP_EXT_MODE || 'typed',
    },
  },
})
