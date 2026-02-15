<template>
  <div class="app-container">
    <header class="app-header">
      <h1>📚 登録単語一覧 (v2.0)</h1>
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
          <div class="word-item-main">
            <div class="word-grid">
              <div class="col col-text">
                <div class="word-text" @click="toggleAffixAnalysis(word.id)">{{ word.text }}</div>
                <div class="word-time">{{ formatTime(word.createdAt) }}</div>
              </div>
              <div class="col col-pron">
                <div v-if="word.pronunciation || word.audioUrl" class="word-pronunciation">
                  <span>{{ word.pronunciation }}</span>
                  <button class="btn-play" @click="playPronunciation(word)" title="再生">🔊</button>
                </div>
              </div>
              <div class="col col-def">
                <div v-if="word.definition" class="word-definition">{{ word.definition }}</div>
              </div>
            </div>
            <button
              class="btn-delete"
              @click="deleteWord(index)"
              title="削除"
            >
              ✕
            </button>
          </div>
          <!-- Affix Analysis Row - moved below the main word grid -->
          <div v-if="selectedWordId === word.id" class="affix-analysis-row">
            <div class="affix-analysis">
              <div class="affix-header">
                <span class="affix-icon">🔤</span>
                <span class="affix-title">Word Structure</span>
              </div>
              <div v-if="getAnalysis(word.text)" class="affix-content">
                <div class="breakdown">
                  <strong>Breakdown:</strong> {{ getBreakdown(word.text) }}
                </div>
                <div class="components">
                  <strong>Components:</strong> {{ getComponents(word.text) }}
                </div>
              </div>
              <div v-else class="affix-none">
                No affix pattern detected
              </div>
            </div>
          </div>
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
import { onMounted, ref } from 'vue'
import { useWords } from './composables/useWords'
import { useAffixAnalysis } from './composables/useAffixAnalysis'

const { words, loading, error, deleteWord, fetchWords } = useWords()
const { analyzeWord, formatAnalysis, getBreakdownVisualization } = useAffixAnalysis()

// Affix analysis state
const selectedWordId = ref<number | null>(null)

/**
 * 再生: `audioUrl` があればそれを再生し、なければ SpeechSynthesis を使う
 */
function playPronunciation(word: any) {
  if (typeof window === 'undefined') return
  try {
    if (word.audioUrl) {
      const a = new Audio(word.audioUrl)
      a.play().catch(() => {
        // フォールバックで TTS
        speakWithTTS(word.text)
      })
      return
    }
    speakWithTTS(word.text)
  } catch (e) {
    console.error('Play error', e)
  }
}

function speakWithTTS(text: string) {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return
  const utter = new SpeechSynthesisUtterance(text)
  utter.lang = 'en-US'
  window.speechSynthesis.cancel()
  window.speechSynthesis.speak(utter)
}

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

// ===== AFFIX ANALYSIS FUNCTIONS =====

/**
 * Toggle affix analysis display for a word
 */
function toggleAffixAnalysis(wordId: number) {
  selectedWordId.value = selectedWordId.value === wordId ? null : wordId
}

/**
 * Get affix analysis for a word
 */
function getAnalysis(word: string) {
  return analyzeWord(word)
}

/**
 * Get breakdown visualization for a word
 */
function getBreakdown(word: string) {
  const analysis = analyzeWord(word)
  return analysis ? getBreakdownVisualization(analysis) : ''
}

/**
 * Get formatted components for a word
 */
function getComponents(word: string) {
  const analysis = analyzeWord(word)
  return analysis ? formatAnalysis(analysis) : ''
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
  flex-direction: column;
  padding: 12px 16px;
  background: #f8f9fa;
  border-radius: 6px;
  border-left: 3px solid #007bff;
  transition: background 0.2s;
  position: relative;
}

.word-item:hover {
  background: #e9ecef;
}

.word-item-main {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}

.word-time {
  font-size: 12px;
  color: #6c757d;
  white-space: nowrap;
}

.word-pronunciation {
  font-size: 13px;
  color: #495057;
  margin-right: 8px;
}

/* New layout: three columns */
.word-grid {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  width: 100%;
  flex: 1;
}
.col {
  display: flex;
  flex-direction: column;
}
.col-text {
  flex-basis: 35%;
  min-width: 120px;
}
.col-pron {
  flex-basis: 20%;
  min-width: 80px;
}
.col-def {
  flex-basis: 45%;
}

.word-text {
  font-size: 16px;
  font-weight: 600;
  color: #212529;
  overflow-wrap: anywhere;
  word-break: normal;
  cursor: pointer;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  transition: all 0.2s ease;
}

.word-text:hover {
  background: #f8f9fa;
  color: #007bff;
}

/* ===== AFFIX ANALYSIS STYLES ===== */

.affix-analysis-row {
  margin-top: 0.75rem;
  width: 100%;
}

.affix-analysis {
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 0.5rem;
  border-left: 4px solid #007bff;
  margin-left: 0;
}

.affix-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
}

.affix-icon {
  font-size: 1.2rem;
}

.affix-title {
  font-weight: 600;
  color: #333;
  font-size: 1rem;
}

.affix-content {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.breakdown, .components {
  font-size: 0.875rem;
  color: #495057;
}

.affix-none {
  font-size: 0.875rem;
  color: #6c757d;
  font-style: italic;
}

.analysis-title {
  font-weight: 600;
  color: #333;
  margin-bottom: 0.75rem;
  font-size: 1.1rem;
}

.breakdown-visual {
  font-family: 'Courier New', monospace;
  font-size: 1.2rem;
  padding: 0.75rem;
  background: white;
  border-radius: 0.375rem;
  margin-bottom: 1rem;
  text-align: center;
  border: 2px solid #e9ecef;
}

.components-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.component-item {
  display: flex;
  align-items: center;
  padding: 0.5rem;
  background: white;
  border-radius: 0.375rem;
  border: 1px solid #dee2e6;
}

.component-type {
  font-weight: 600;
  color: #6f42c1;
  min-width: 4rem;
  font-size: 0.875rem;
  text-transform: uppercase;
}

.component-text {
  font-weight: 500;
  color: #333;
  margin: 0 0.75rem;
  font-family: 'Courier New', monospace;
}

.word-definition {
  white-space: normal;
}

.btn-play {
  background: none;
  border: none;
  cursor: pointer;
  margin-left: 0.5rem;
  padding: 0.2rem;
  border-radius: 0.25rem;
  transition: background-color 0.2s;
}

.btn-play:hover {
  background: #f8f9fa;
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
  flex-shrink: 0;
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
