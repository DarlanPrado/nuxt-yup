export default defineNuxtConfig({
  modules: ['../src/module'],
  runtimeConfig: {
    public: {
      yupExtMode: process.env.NUXT_YUP_EXT_MODE || 'typed',
    },
  },
  devtools: {
    enabled: true,

    timeline: {
      enabled: true,
    },
  },
})
