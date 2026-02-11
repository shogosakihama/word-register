"""
FastAPI バックエンド - 単語登録API
"""
from datetime import datetime
from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from database import engine, get_db, Base
from models import Word
from schemas import WordCreate, WordResponse, WordListResponse

# テーブル作成
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="単語登録API",
    description="Chrome拡張機能から単語を登録・管理するAPI",
    version="1.0.0",
)

# CORS設定（Nuxtアプリからのアクセスを許可）
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:3001",
        "http://localhost:3002",
        "http://localhost:3003",
        "http://localhost:3004",
        "http://localhost:3005",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def root():
    """ヘルスチェック"""
    return {"status": "ok", "message": "単語登録API"}


@app.get("/api/words", response_model=WordListResponse)
def get_words(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """
    単語一覧を取得
    """
    words = db.query(Word).order_by(Word.created_at.desc()).offset(skip).limit(limit).all()
    total = db.query(Word).count()
    return WordListResponse(
        words=[WordResponse(
            id=w.id,
            text=w.text,
            pageUrl=w.page_url,
            createdAt=w.created_at,
        ) for w in words],
        total=total,
    )


@app.post("/api/words", response_model=WordResponse, status_code=201)
def create_word(word: WordCreate, db: Session = Depends(get_db)):
    """
    単語を登録
    """
    print(f"[API] Creating word: {word.text}")
    
    # createdAt を解析
    created_at = None
    if word.createdAt:
        try:
            created_at = datetime.fromisoformat(word.createdAt.replace("Z", "+00:00"))
        except ValueError:
            created_at = datetime.utcnow()
    else:
        created_at = datetime.utcnow()

    db_word = Word(
        text=word.text,
        page_url=word.pageUrl,
        created_at=created_at,
    )
    db.add(db_word)
    print(f"[API] Added word to session: {db_word.text}")
    
    db.commit()
    print(f"[API] Committed transaction")
    
    db.refresh(db_word)
    print(f"[API] Refreshed word with ID: {db_word.id}")
    
    return WordResponse(
        id=db_word.id,
        text=db_word.text,
        pageUrl=db_word.page_url,
        createdAt=db_word.created_at,
    )


@app.delete("/api/words/{word_id}", status_code=204)
def delete_word(word_id: int, db: Session = Depends(get_db)):
    """
    単語を削除
    """
    word = db.query(Word).filter(Word.id == word_id).first()
    if not word:
        raise HTTPException(status_code=404, detail="Word not found")
    
    db.delete(word)
    db.commit()
    return None


@app.delete("/api/words", status_code=204)
def delete_all_words(db: Session = Depends(get_db)):
    """
    全単語を削除
    """
    db.query(Word).delete()
    db.commit()
    return None
