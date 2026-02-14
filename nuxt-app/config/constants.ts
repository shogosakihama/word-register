// Production API configuration
// This bypasses all Nuxt runtime config and environment variable systems
export const API_BASE_URL = 'https://word-register-production.up.railway.app'
export const API_ENDPOINTS = {
  words: `${API_BASE_URL}/api/words`,
  health: `${API_BASE_URL}/health`
} as const