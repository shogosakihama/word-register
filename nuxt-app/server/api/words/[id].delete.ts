import { defineEventHandler } from 'h3'

const BACKEND_URL = 'https://word-register-production.up.railway.app'

// Proxy handler for DELETE /api/words/:id -> forwards to Railway backend
export default defineEventHandler(async (event) => {
  const id = event.context.params?.id
  if (!id) {
    event.node.res.statusCode = 400
    return { error: 'Missing word ID' }
  }

  const backendUrl = `${BACKEND_URL}/api/words/${id}`

  try {
    const res = await fetch(backendUrl, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    
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
