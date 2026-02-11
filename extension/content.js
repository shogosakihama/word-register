/**
 * Content Script (content.js)
 * 
 * 責務:
 * - Webページ内でユーザーが選択したテキストを検出・取得
 * - 現在のページURLを取得
 * - 選択テキストを Background に通知
 * 
 * 実行タイミング:
 * - document_start で読み込まれる（できるだけ早期にイベントリスナーを設定）
 * 
 * 注意:
 * - Nuxtアプリの DOM を直接操作しない（責務分離）
 * - Background.js とのみ通信
 */

console.log('[Content Script] Loaded on', window.location.href)

/**
 * ユーザーがテキストを選択したときのイベントリスナー
 */
document.addEventListener('selectionchange', () => {
  const selection = window.getSelection()
  const selectedText = selection ? selection.toString().trim() : ''

  if (selectedText) {
    console.log('[Content Script] Text selected:', selectedText)
  }
})

/**
 * マウスアップイベントでも選択をキャッチ（selectionchangeが動作しないページ用）
 */
document.addEventListener('mouseup', () => {
  const selection = window.getSelection()
  const selectedText = selection ? selection.toString().trim() : ''

  if (selectedText) {
    console.log('[Content Script] Text selected (mouseup):', selectedText)
  }
})

/**
 * Background からのメッセージを受信
 * 
 * メッセージフォーマット:
 * {
 *   action: 'getSelectedText'
 * }
 * 
 * 返信:
 * {
 *   text: 選択されたテキスト (string)
 *   pageUrl: 現在のURL (string)
 *   timestamp: 時刻 (ISO8601)
 * }
 */
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('[Content Script] Received message:', message)

  if (message.action === 'getSelectedText') {
    // メッセージ受信時に現在の選択テキストを取得（保存された値ではなく）
    const selection = window.getSelection()
    const currentSelectedText = selection ? selection.toString().trim() : ''
    
    const response = {
      text: currentSelectedText,
      pageUrl: window.location.href,
      timestamp: new Date().toISOString(),
    }

    console.log('[Content Script] Sending response:', response)
    sendResponse(response)
  }

  if (message.action === 'sendToAPI') {
    // APIに単語を送信
    console.log('[Content Script] Sending word to API:', message.word)

    fetch('http://localhost:8000/api/words', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(message.word),
    })
    .then(response => {
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`)
      }
      return response.json()
    })
    .then(savedWord => {
      console.log('[Content Script] Word saved to database:', savedWord)

      // chrome.storage経由でNuxtアプリに通知
      chrome.storage.local.set({
        lastSavedWord: {
          ...savedWord,
          notifiedAt: Date.now(),
        }
      })
    })
    .catch(error => {
      console.error('[Content Script] Failed to send word to API:', error)
      // オフライン時のフォールバック
      const pendingKey = 'pendingWord-' + Date.now()
      chrome.storage.local.set({
        [pendingKey]: message.word
      })
    })

    sendResponse({ status: 'processing' })
  }
})

/**
 * Background からのメッセージを受信（Nuxt アプリ内）
 * localhost の Content Script のみ実行
 * Background が API に保存した後、wordSaved メッセージを送ってくる
 */
if (window.location.hostname === 'localhost') {
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'wordSaved' && message.payload) {
      console.log('[Content Script] Word saved notification:', message.payload)

      // Nuxt アプリに postMessage で通知
      window.postMessage({
        action: 'wordSaved',
        payload: message.payload,
      }, '*')

      sendResponse({ status: 'ok' })
    }
  })

  console.log('[Content Script] wordSaved listener initialized on', window.location.origin)
}
