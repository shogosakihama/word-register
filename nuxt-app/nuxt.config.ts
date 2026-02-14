export default defineNuxtConfig({
  modules: ['@pinia/nuxt'],
  alias: {
    '~': '.',
  },
  // Explicitly disable runtime config to prevent environment variable injection
  runtimeConfig: {
    // Empty public runtime config
    public: {}
  }
})
