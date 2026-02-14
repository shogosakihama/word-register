export default defineNuxtConfig({
  modules: ['@pinia/nuxt'],
  alias: {
    '~': '.',
  },
  runtimeConfig: {
    public: {
      apiBaseUrl: (process.env.NUXT_PUBLIC_API_BASE_URL || 'https://word-register-production.up.railway.app').trim()
    }
  }
})
