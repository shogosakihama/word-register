/**
 * Nuxt プラグイン: Chrome Extension との通信
 *
 * 責務:
 * - 定期的にAPIをポーリングしてUIを自動更新
 * - Content Script からのメッセージを受信
 */

import { useWordsStore } from '../stores/words'
import { API_ENDPOINTS } from '~/config/constants'

declare global {
  interface Window {
    $testExtensionMessage?: () => void
  }
}

export default defineNuxtPlugin(() => {
  // SSR環境では実行しない
  if (process.server) {
    console.log('[Plugin] Skipping on server-side')
    return
  }

  console.log('[Plugin] Chrome Extension support initialized')

  // Pinia ストアを取得
  const wordsStore = useWordsStore()

  /**
   * 3秒ごとにAPIをポーリングしてUIを自動更新
   * Background Service Worker が直接APIに保存するため、
   * Nuxt側はDBの最新状態をポーリングで取得する
   */
  let lastWordCount = 0
  const pollInterval = setInterval(async () => {
    try {
      const response = await fetch(API_ENDPOINTS.words)
      if (!response.ok) return
      const data = await response.json()
      const newCount = data.total || 0
      if (newCount !== lastWordCount) {
        lastWordCount = newCount
        await wordsStore.fetchWords()
        console.log('[Plugin] Words updated via polling, count:', newCount)
      }
    } catch {
      // API接続失敗はサイレントに無視
    }
  }, 3000)

  // ページ離脱時にポーリングを停止
  window.addEventListener('beforeunload', () => {
    clearInterval(pollInterval)
  })

  // グローバル関数: Extension からのメッセージをテストする（開発用）
  if (process.dev) {
    window.$testExtensionMessage = () => {
      console.log('[Test] Simulating Extension message...')
      const testWord = {
        text: 'テスト単語',
        pageUrl: 'https://example.com',
        createdAt: new Date().toISOString(),
      }
      wordsStore.registerWord(testWord)
      console.log('[Test] Test word added:', testWord)
    }
  }
})
