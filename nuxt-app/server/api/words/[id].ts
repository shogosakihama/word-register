import { defineEventHandler, getMethod } from 'h3'

const BACKEND_URL = 'https://word-register-production.up.railway.app'

// Proxy handler for /api/words/:id (GET, DELETE, etc.)
export default defineEventHandler(async (event) => {
  const method = getMethod(event)
  const id = event.context.params?.id
  
  if (!id) {
    event.node.res.statusCode = 400
    return { error: 'Missing word ID' }
  }

  const backendUrl = `${BACKEND_URL}/api/words/${id}`

  console.log(`[Proxy] ${method} ${backendUrl}`)

  try {
    const res = await fetch(backendUrl, {
      method: method,
      headers: {
        'Content-Type': 'application/json'
      }
    })
    
    console.log(`[Proxy] Backend response: ${res.status}`)
    
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
    console.error(`[Proxy] Error:`, err)
    event.node.res.statusCode = 502
    return { error: 'Bad Gateway', detail: String(err.message || err) }
  }
})
