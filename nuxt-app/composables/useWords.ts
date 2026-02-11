import { computed } from 'vue'
import { useWordsStore } from '../stores/words'
import type { Word } from '../types/word'

/**
 * Composable: 単語操作の利便性向上
 * 
 * 役割:
 * - ストアの呼び出しを簡潔に
 * - ビジネスロジックの抽象化
 */
export function useWords() {
  const store = useWordsStore()

  /**
   * APIから単語一覧を取得
   */
  function fetchWords() {
    return store.fetchWords()
  }

  /**
   * テキストから単語を登録
   * @param selectedText ユーザーが選択したテキスト
   * @param pageUrl 現在のページURL
   */
  function registerWordFromSelection(selectedText: string, pageUrl: string) {
    if (!selectedText.trim()) {
      console.warn('Empty text cannot be registered')
      return
    }

    const word: Omit<Word, 'id'> = {
      text: selectedText.trim(),
      pageUrl,
      createdAt: new Date().toISOString(),
    }

    return store.registerWord(word)
  }

  /**
   * 単語を削除
   * @param index 削除対象のインデックス
   */
  function deleteWord(index: number) {
    return store.removeWord(index)
  }

  return {
    // state
    words: computed(() => store.words),
    wordCount: computed(() => store.wordCount),
    loading: computed(() => store.loading),
    error: computed(() => store.error),
    // actions
    fetchWords,
    registerWordFromSelection,
    deleteWord,
  }
}
