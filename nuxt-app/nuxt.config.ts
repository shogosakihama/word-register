export default defineNuxtConfig({
  modules: ['@pinia/nuxt'],
  alias: {
    '~': '.',
  },
  runtimeConfig: {
    public: {
      apiBaseUrl: process.env.NUXT_PUBLIC_API_BASE_URL || 'http://localhost:8000'
    }
  }
})
