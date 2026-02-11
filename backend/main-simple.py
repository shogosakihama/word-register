"""
シンプルなFastAPI - SQLite + インメモリ版
"""
from datetime import datetime
from typing import List, Optional
import json
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

# メモリ内ストレージ（開発用）
words_db = []

app = FastAPI(
    title="単語登録API (Simple)",
    description="Chrome拡張機能から単語を登録・管理するAPI (SQLite版)",
    version="1.0.0",
)

# CORS設定
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# スキーマ定義
class WordCreate(BaseModel):
    text: str
    pageUrl: Optional[str] = None
    createdAt: Optional[str] = None

class WordResponse(BaseModel):
    id: int
    text: str
    pageUrl: Optional[str] = None
    createdAt: str

class WordListResponse(BaseModel):
    words: List[WordResponse]
    total: int

# ルート
@app.get("/")
def root():
    return {"status": "ok", "message": "単語登録API (Simple版)"}

@app.get("/api/words", response_model=WordListResponse)
def get_words(skip: int = 0, limit: int = 100):
    """単語一覧を取得"""
    start = skip
    end = skip + limit
    selected_words = words_db[start:end]
    
    return WordListResponse(
        words=[
            WordResponse(
                id=word["id"],
                text=word["text"],
                pageUrl=word.get("pageUrl", ""),
                createdAt=word["createdAt"]
            )
            for word in selected_words
        ],
        total=len(words_db)
    )

@app.post("/api/words", response_model=WordResponse, status_code=201)
def create_word(word: WordCreate):
    """単語を登録"""
    # ID生成
    word_id = len(words_db) + 1
    
    # タイムスタンプ処理
    if word.createdAt:
        created_at = word.createdAt
    else:
        created_at = datetime.utcnow().isoformat() + "Z"
    
    # 新しい単語
    new_word = {
        "id": word_id,
        "text": word.text,
        "pageUrl": word.pageUrl or "",
        "createdAt": created_at
    }
    
    words_db.insert(0, new_word)  # 新しいものを先頭に
    
    return WordResponse(**new_word)

@app.delete("/api/words/{word_id}", status_code=204)
def delete_word(word_id: int):
    """単語を削除"""
    global words_db
    words_db = [w for w in words_db if w["id"] != word_id]
    return None

@app.delete("/api/words", status_code=204)
def delete_all_words():
    """全単語を削除"""
    global words_db
    words_db = []
    return None

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)