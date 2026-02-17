// Environment-aware API configuration
const isDevelopment = import.meta.env.MODE === 'development' || import.meta.dev
const isProd = import.meta.env.MODE === 'production' || !import.meta.dev

// Development: Use local backend if available, fallback to production
const DEVELOPMENT_API_URL = import.meta.env.DEV_API_URL || 'https://word-register-production.up.railway.app'

// Production: Always use Railway backend
const PRODUCTION_API_URL = 'https://word-register-production.up.railway.app'

export const API_BASE_URL = isDevelopment ? DEVELOPMENT_API_URL : PRODUCTION_API_URL

// Use relative paths to go through Nuxt server proxy and avoid CORS
export const API_ENDPOINTS = {
  words: '/api/words',
  health: `${API_BASE_URL}/health`
} as const

console.log(`[Environment] API_BASE_URL: ${API_BASE_URL}`)