/**
 * Nuxt プラグイン: Chrome Extension との通信
 *
 * 責務:
 * - 定期的にAPIをポーリングしてUIを自動更新
 * - Content Script からのメッセージを受信
 */

import type { NuxtPlugin } from '#app'
import { useWordsStore } from '../stores/words'
import { API_ENDPOINTS } from '../config/constants'

declare global {
  interface Window {
    $testExtensionMessage?: () => void
    $pausePolling?: (duration: number) => void
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
   * ポーリング機能は一時的に無効化
   * 削除機能の問題を解決するため
   */
  console.log('[Plugin] Polling disabled for debugging')
  
  // Global function stub (for compatibility)
  window.$pausePolling = (duration: number) => {
    console.log(`[Plugin] Polling pause requested but polling is disabled`)
  }

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
