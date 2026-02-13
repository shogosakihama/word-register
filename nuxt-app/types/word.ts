/**
 * 単語データ構造
 * 
 * 設計メモ:
 * - Python FastAPI バックエンドと連携
 * - ISO8601形式で統一
 */
export interface Word {
  id?: number         // データベースID（新規登録時はundefined）
  text: string        // 選択された単語
  pronunciation?: string // 発音記号（optional）
  definition?: string    // 単語の説明（optional）
  audioUrl?: string     // 発音音声のURL（optional）
  pageUrl: string     // 現在のページURL
  createdAt: string   // ISO8601形式（例: 2026-02-07T12:30:45.123Z）
}
