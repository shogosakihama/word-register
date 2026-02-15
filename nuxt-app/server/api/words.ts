import { defineEventHandler, readBody } from 'h3'

// Relative path to config
import { API_BASE_URL } from '../../config/constants'

// Proxy handler for /api/words -> forwards to remote backend to avoid CORS
export default defineEventHandler(async (event) => {
  const method = (event.node.req.method || 'GET').toUpperCase()
  const backendUrl = (API_BASE_URL || 'https://word-register-production.up.railway.app') + '/api/words'

  const headers: Record<string, string> = {}
  // copy select request headers (e.g., auth) if present
  const reqHeaders = event.node.req.headers || {}
  if (reqHeaders.authorization) headers['authorization'] = String(reqHeaders.authorization)
  if (reqHeaders['content-type']) headers['content-type'] = String(reqHeaders['content-type'])

  const fetchOptions: any = {
    method,
    headers,
  }

  if (method !== 'GET' && method !== 'HEAD') {
    const body = await readBody(event)
    if (body !== undefined) fetchOptions.body = JSON.stringify(body)
  }

  try {
    const res = await fetch(backendUrl, fetchOptions)
    const text = await res.text()
    // propagate status
    event.node.res.statusCode = res.status
    // try to parse JSON, otherwise return text
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
