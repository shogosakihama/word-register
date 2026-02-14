export default defineNuxtConfig({
  modules: ['@pinia/nuxt'],
  alias: {
    '~': '.',
  },
  runtimeConfig: {
    public: {
      // Production API endpoint for Railway backend
      baseApiUrl: 'https://word-register-production.up.railway.app'
    }
  }
})
