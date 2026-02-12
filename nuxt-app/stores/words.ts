import { defineStore } from 'pinia'
import { ref, computed, readonly } from 'vue'
import type { Word } from '../types/word'

/**
 * Pinia ストア: 単語管理
 * 
 * 責務:
 * - 状態管理（単語リスト）
 * - Python FastAPI バックエンドとの連携
 * - registerWord: 単語登録 → POST /api/words
 * - removeWord: 単語削除 → DELETE /api/words/:id
 * - fetchWords: 単語一覧取得 → GET /api/words
 */
export const useWordsStore = defineStore('words', () => {
  const config = useRuntimeConfig()
  const API_BASE_URL = config.public.apiBaseUrl as string
  
  // ===== STATE =====
  const words = ref<Word[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  // ===== GETTERS =====
  const wordCount = computed(() => words.value.length)

  // ===== ACTIONS =====

  /**
   * APIから単語一覧を取得
   */
  async function fetchWords() {
    loading.value = true
    error.value = null
    try {
      const response = await fetch(`${API_BASE_URL}/api/words`)
      if (!response.ok) throw new Error('Failed to fetch words')
      const data = await response.json()
      words.value = data.words.map((w: any) => ({
        id: w.id,
        text: w.text,
        pronunciation: w.pronunciation,
        definition: w.definition,
        pageUrl: w.pageUrl,
        createdAt: w.createdAt,
      }))
      console.log('[Store] Words fetched:', words.value.length)
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Unknown error'
      console.error('[Store] Fetch error:', error.value)
    } finally {
      loading.value = false
    }
  }

  /**
   * 単語を登録（バックエンドAPI経由）
   * @param word 登録する単語データ
   */
  async function registerWord(word: Omit<Word, 'id'>) {
    loading.value = true
    error.value = null
    try {
      const response = await fetch(`${API_BASE_URL}/api/words`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(word),
      })
      if (!response.ok) throw new Error('Failed to register word')
      const savedWord = await response.json()
      words.value.unshift({
        id: savedWord.id,
        text: savedWord.text,
        pronunciation: savedWord.pronunciation,
        definition: savedWord.definition,
        pageUrl: savedWord.pageUrl,
        createdAt: savedWord.createdAt,
      })
      console.log('[Store] Word registered:', savedWord)
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Unknown error'
      console.error('[Store] Register error:', error.value)
    } finally {
      loading.value = false
    }
  }

  /**
   * 単語を削除（バックエンドAPI経由）
   * @param index 削除対象の配列インデックス
   */
  async function removeWord(index: number) {
    if (index < 0 || index >= words.value.length) return
    
    const word = words.value[index]
    if (!word.id) {
      words.value.splice(index, 1)
      return
    }

    loading.value = true
    error.value = null
    try {
      const response = await fetch(`${API_BASE_URL}/api/words/${word.id}`, {
        method: 'DELETE',
      })
      if (!response.ok) throw new Error('Failed to delete word')
      words.value.splice(index, 1)
      console.log('[Store] Word removed:', word)
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Unknown error'
      console.error('[Store] Delete error:', error.value)
    } finally {
      loading.value = false
    }
  }

  /**
   * 全単語を削除
   */
  async function clearAll() {
    loading.value = true
    error.value = null
    try {
      const response = await fetch(`${API_BASE_URL}/api/words`, {
        method: 'DELETE',
      })
      if (!response.ok) throw new Error('Failed to clear words')
      words.value = []
      console.log('[Store] All words cleared')
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Unknown error'
      console.error('[Store] Clear error:', error.value)
    } finally {
      loading.value = false
    }
  }

  return {
    // state
    words,
    loading,
    error,
    // getters
    wordCount,
    // actions
    fetchWords,
    registerWord,
    removeWord,
    clearAll,
  }
})
