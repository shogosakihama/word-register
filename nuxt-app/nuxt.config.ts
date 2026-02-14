export default defineNuxtConfig({
  modules: ['@pinia/nuxt'],
  alias: {
    '~': '.',
  },
  runtimeConfig: {
    public: {
      // Use a different key name to avoid Vercel's automatic NUXT_PUBLIC_* override
      baseApiUrl: 'https://word-register-production.up.railway.app'
    }
  }
})
