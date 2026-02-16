import { defineEventHandler, readBody } from 'h3'

const BACKEND_URL = 'https://word-register-production.up.railway.app'

// Proxy handler for /api/words -> forwards to Railway backend to avoid CORS
export default defineEventHandler(async (event) => {
  const method = (event.node.req.method || 'GET').toUpperCase()
  const backendUrl = `${BACKEND_URL}/api/words`

  const headers: Record<string, string> = {
    'Content-Type': 'application/json'
  }

  const fetchOptions: any = {
    method,
    headers,
  }

  if (method !== 'GET' && method !== 'HEAD') {
    try {
      const body = await readBody(event)
      if (body !== undefined) fetchOptions.body = JSON.stringify(body)
    } catch (e) {
      // No body for this request
    }
  }

  try {
    const res = await fetch(backendUrl, fetchOptions)
    const text = await res.text()
    
    event.node.res.statusCode = res.status
    
    const contentType = res.headers.get('content-type') || ''
    if (contentType.includes('application/json')) {
      try {
        return JSON.parse(text)
      } catch (e) {
        return text
      }
    }
    return text
  } catch (err: any) {
    event.node.res.statusCode = 502
    return { error: 'Bad Gateway', detail: String(err.message || err) }
  }
})
