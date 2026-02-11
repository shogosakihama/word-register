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
  pageUrl: string     // 現在のページURL
  createdAt: string   // ISO8601形式（例: 2026-02-07T12:30:45.123Z）
}
