/**
 * Background Service Worker (background.js)
 *
 * 責務:
 * 1. 右クリックコンテキストメニュー「単語を登録」を作成・管理
 * 2. ユーザーがメニュー選択 → Content Script に「getSelectedText」を送信
 * 3. Content Script から選択テキストを受け取る
 * 4. 単語データを Nuxt UI に送信
 *
 * ライフサイクル:
 * - 拡張機能インストール時: contextMenus 作成
 * - 右クリック時: contextMenu.onClicked リスナー発火
 */

console.log('[Background] Service Worker started')

// ===== 初期化: コンテキストメニュー作成 =====

/**
 * 拡張機能のインストール・更新時に実行
 */
chrome.runtime.onInstalled.addListener(() => {
  console.log('[Background] Extension installed/updated')
  createContextMenu()
})

/**
 * コンテキストメニュー「単語を登録」を作成
 */
function createContextMenu() {
  try {
    chrome.contextMenus.create({
      id: 'registerWord',
      title: '単語を登録',
      contexts: ['selection'], // テキスト選択時のみ表示
    })
    console.log('[Background] Context menu created')
  } catch (error) {
    console.error('[Background] Failed to create context menu:', error)
  }
}

// ===== コンテキストメニュー処理 =====

/**
 * ユーザーが「単語を登録」をクリック
 */
chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  console.log('[Background] Context menu clicked', { menuItemId: info.menuItemId, tabId: tab.id, tabUrl: tab.url })

  if (info.menuItemId !== 'registerWord') {
    return
  }

  // selectionText はコンテキストメニューAPIが自動取得（Content Script不要）
  const selectedText = info.selectionText?.trim()
  if (!selectedText) {
    console.error('[Background] No selected text')
    return
  }

  const word = {
    text: selectedText,
    pageUrl: tab.url || '',
    createdAt: new Date().toISOString(),
  }

  // Background から直接APIに送信（Service WorkerはCORS制約なし）
  // 本番: https://word-register-production.up.railway.app
  // ローカル開発: http://localhost:8000
  const API_URL = 'https://word-register-production.up.railway.app/api/words'
  try {
    console.log('[Background] Saving word to API:', word)
    const apiResponse = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(word),
    })

    if (!apiResponse.ok) {
      throw new Error(`API error: ${apiResponse.status}`)
    }

    const savedWord = await apiResponse.json()
    console.log('[Background] Word saved:', savedWord)
  } catch (error) {
    console.error('[Background] Failed to save word:', error)
  }
})

// ===== デバッグ用リスナー =====

/**
 * Nuxt からのメッセージを受信（テスト用）
 */
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('[Background] Message from Nuxt:', message, 'from:', sender.url)

  if (message.action === 'ping') {
    sendResponse({ status: 'pong', message: 'Background is alive!' })
  }
})
