export default defineNuxtConfig({
  modules: ['@pinia/nuxt'],
  alias: {
    '~': '.',
  }
  // Removed runtimeConfig to avoid Vercel environment variable conflicts
})
