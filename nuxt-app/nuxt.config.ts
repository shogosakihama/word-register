export default defineNuxtConfig({
  modules: ['@pinia/nuxt'],
  alias: {
    '~': '.',
  },
  runtimeConfig: {
    public: {
      // Force production URL regardless of environment variable to fix CORS issue
      apiBaseUrl: 'https://word-register-production.up.railway.app'
    }
  }
})
