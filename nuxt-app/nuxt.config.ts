export default defineNuxtConfig({
  compatibilityDate: '2026-02-14',
  modules: ['@pinia/nuxt'],
  alias: {
    '~': '.',
  },
  // Clean runtime config - no environment variable injection
  runtimeConfig: {
    public: {}
  },
  // Ensure no SSR issues
  ssr: true
})
