/**
 * Node.js Express サーバー（開発用）
 */
const express = require('express')
const cors = require('cors')
const fs = require('fs')
const path = require('path')

const app = express()
const PORT = 8000
const DB_FILE = path.join(__dirname, 'words.json')

// CORSとJSONパース
app.use(cors({
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000']
}))
app.use(express.json())

// データベース（JSONファイル）
function loadWords() {
  try {
    const data = fs.readFileSync(DB_FILE, 'utf8')
    return JSON.parse(data)
  } catch (error) {
    return []
  }
}

function saveWords(words) {
  fs.writeFileSync(DB_FILE, JSON.stringify(words, null, 2))
}

// ルート
app.get('/', (req, res) => {
  res.json({ status: 'ok', message: '単語登録API (Node.js版)' })
})

app.get('/api/words', (req, res) => {
  const words = loadWords()
  res.json({
    words: words,
    total: words.length
  })
})

app.post('/api/words', (req, res) => {
  const { text, pageUrl, createdAt } = req.body
  
  const words = loadWords()
  const newWord = {
    id: words.length + 1,
    text,
    pageUrl: pageUrl || '',
    createdAt: createdAt || new Date().toISOString()
  }
  
  words.unshift(newWord) // 新しいものを先頭に
  saveWords(words)
  
  res.status(201).json(newWord)
})

app.delete('/api/words/:id', (req, res) => {
  const wordId = parseInt(req.params.id)
  const words = loadWords()
  const filteredWords = words.filter(w => w.id !== wordId)
  saveWords(filteredWords)
  res.status(204).send()
})

app.delete('/api/words', (req, res) => {
  saveWords([])
  res.status(204).send()
})

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`)
  console.log('📝 Words DB:', DB_FILE)
})