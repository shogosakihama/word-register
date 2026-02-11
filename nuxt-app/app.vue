<template>
  <div class="app-container">
    <header class="app-header">
      <h1>📚 登録単語一覧</h1>
      <p class="subtitle">Webで選択 → 右クリック → 「単語を登録」</p>
    </header>

    <main class="app-main">
      <!-- ローディング中 -->
      <div v-if="loading" class="loading-state">
        <p>⏳ 読み込み中...</p>
      </div>

      <!-- エラー表示 -->
      <div v-else-if="error" class="error-state">
        <p>❌ エラー: {{ error }}</p>
        <button class="btn-retry" @click="fetchWords">再試行</button>
      </div>

      <!-- 単語が無い場合 -->
      <div v-else-if="words.length === 0" class="empty-state">
        <p>📭 まだ単語が登録されていません</p>
        <p class="hint">Webページから単語を選択して右クリックしてください</p>
      </div>

      <!-- 単語一覧 -->
      <div v-else class="words-list">
        <div
          v-for="(word, index) in words"
          :key="word.id || `${word.createdAt}-${index}`"
          class="word-item"
        >
          <div class="word-content">
            <span class="word-text">{{ word.text }}</span>
            <span class="word-time">{{ formatTime(word.createdAt) }}</span>
          </div>
          <button
            class="btn-delete"
            @click="deleteWord(index)"
            title="削除"
          >
            ✕
          </button>
        </div>
      </div>

      <!-- デバッグ情報 -->
      <div class="debug-section">
        <p>{{ words.length }} 個の単語を登録済み</p>
        <button class="btn-refresh" @click="fetchWords">🔄 更新</button>
        <button
          v-if="isDev"
          class="btn-debug"
          @click="testAddWord"
        >
          🧪 デバッグ: テスト単語追加
        </button>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useWords } from './composables/useWords'

const { words, loading, error, deleteWord, fetchWords } = useWords()

// 開発環境判定
const isDev = process.dev

// マウント時にAPIから単語を取得
onMounted(() => {
  fetchWords()
})

/**
 * ISO8601 → 表示用に変換
 * @param isoString ISO8601形式の日時文字列
 * @returns HH:MM形式
 */
function formatTime(isoString: string): string {
  const date = new Date(isoString)
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  return `${hours}:${minutes}`
}

/**
 * デバッグ用: テスト単語を追加
 * (開発環境でのみ表示)
 */
function testAddWord() {
  if (typeof window !== 'undefined' && window.$testExtensionMessage) {
    window.$testExtensionMessage()
  } else {
    console.warn('Test function not available')
  }
}
</script>

<style scoped>
.app-container {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  background: #f8f9fa;
  min-height: 100vh;
}

.app-header {
  text-align: center;
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 2px solid #e9ecef;
}

.app-header h1 {
  margin: 0;
  font-size: 24px;
  color: #212529;
}

.subtitle {
  margin: 8px 0 0 0;
  font-size: 14px;
  color: #6c757d;
}

.app-main {
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.empty-state {
  text-align: center;
  padding: 40px 20px;
  color: #6c757d;
}

.empty-state p {
  margin: 8px 0;
}

.hint {
  font-size: 12px;
  color: #adb5bd;
}

.words-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.word-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background: #f8f9fa;
  border-radius: 6px;
  border-left: 3px solid #007bff;
  transition: background 0.2s;
}

.word-item:hover {
  background: #e9ecef;
}

.word-content {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 16px;
}

.word-text {
  font-size: 16px;
  font-weight: 500;
  color: #212529;
  word-break: break-all;
}

.word-time {
  font-size: 12px;
  color: #6c757d;
  white-space: nowrap;
}

.btn-delete {
  padding: 4px 8px;
  margin-left: 12px;
  background: #dc3545;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  transition: background 0.2s;
}

.btn-delete:hover {
  background: #c82333;
}

.debug-section {
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid #e9ecef;
  font-size: 12px;
  color: #6c757d;
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.btn-refresh {
  padding: 6px 12px;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  transition: background 0.2s;
}

.btn-refresh:hover {
  background: #0056b3;
}

.btn-debug {
  padding: 6px 12px;
  background: #6c757d;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  transition: background 0.2s;
}

.btn-debug:hover {
  background: #5a6268;
}

.loading-state {
  text-align: center;
  padding: 40px 20px;
  color: #6c757d;
}

.error-state {
  text-align: center;
  padding: 40px 20px;
  color: #dc3545;
}

.btn-retry {
  margin-top: 12px;
  padding: 8px 16px;
  background: #dc3545;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.btn-retry:hover {
  background: #c82333;
}
</style>
