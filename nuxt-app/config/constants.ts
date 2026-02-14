// Environment-aware API configuration
const isDevelopment = process.env.NODE_ENV === 'development'
const isProd = process.env.NODE_ENV === 'production'

// Development: Use local backend if available, fallback to production
const DEVELOPMENT_API_URL = process.env.DEV_API_URL || 'https://word-register-production.up.railway.app'

// Production: Always use Railway backend
const PRODUCTION_API_URL = 'https://word-register-production.up.railway.app'

export const API_BASE_URL = isDevelopment ? DEVELOPMENT_API_URL : PRODUCTION_API_URL

export const API_ENDPOINTS = {
  words: `${API_BASE_URL}/api/words`,
  health: `${API_BASE_URL}/health`
} as const

console.log(`[Environment] API_BASE_URL: ${API_BASE_URL}`)