"""
FastAPI バックエンド - 単語登録API
"""
from datetime import datetime
import os
import logging
import sys
from fastapi import FastAPI, Depends, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy import text
import httpx

from database import engine, get_db, Base, SessionLocal
from models import Word
from schemas import WordCreate, WordResponse, WordListResponse

# Configure logging to stdout so platform log collectors capture it
logging.basicConfig(stream=sys.stdout, level=logging.INFO, format="%(asctime)s %(levelname)s %(message)s")
logger = logging.getLogger(__name__)

# テーブル作成 (既存テーブルがある場合はALTERでカラムを追加)
Base.metadata.create_all(bind=engine)


def ensure_columns():
    """Add new columns if they do not exist (Postgres)."""
    try:
        with engine.begin() as conn:
            conn.execute(text("ALTER TABLE words ADD COLUMN IF NOT EXISTS pronunciation TEXT;"))
            conn.execute(text("ALTER TABLE words ADD COLUMN IF NOT EXISTS definition TEXT;"))
    except Exception:
        # Non-fatal; ignore if DB doesn't support ALTER IF NOT EXISTS
        pass


ensure_columns()

app = FastAPI(
    title="単語登録API",
    description="Chrome拡張機能から単語を登録・管理するAPI",
    version="1.0.0",
)

# CORS設定（Nuxtアプリからのアクセスを許可）
allowed = os.getenv("ALLOWED_ORIGINS")
if allowed:
    # カンマ区切りで渡す (例: https://app.vercel.app,http://localhost:3000)
    allow_origins = [a.strip() for a in allowed.split(",") if a.strip()]
else:
    allow_origins = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allow_origins,
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
            pronunciation=w.pronunciation,
            definition=w.definition,
            pageUrl=w.page_url,
            createdAt=w.created_at,
        ) for w in words],
        total=total,
    )


@app.post("/api/words", response_model=WordResponse, status_code=201)
def create_word(word: WordCreate, background_tasks: BackgroundTasks, db: Session = Depends(get_db)):
    """
    単語を登録
    """
    logger.info("[API] Creating word: %s", word.text)
    
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
    logger.info("[API] Added word to session: %s", db_word.text)
    
    db.commit()
    logger.info("[API] Committed transaction")
    
    db.refresh(db_word)
    logger.info("[API] Refreshed word with ID: %s", db_word.id)

    # Schedule background fetch for pronunciation/definition
    background_tasks.add_task(fetch_dictionary_info_and_update, db_word.id, db_word.text)
    
    return WordResponse(
        id=db_word.id,
        text=db_word.text,
        pronunciation=db_word.pronunciation,
        definition=db_word.definition,
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


def fetch_dictionary_info_and_update(word_id: int, text: str):
    """Fetch pronunciation and definition from dictionaryapi.dev and update DB."""
    try:
        logger.info("[BG] Fetching dictionary info for '%s' (id=%s)", text, word_id)
        url = f"https://api.dictionaryapi.dev/api/v2/entries/en/{text}"
        logger.info("[BG] URL: %s", url)
        with httpx.Client(timeout=10.0) as client:
            r = client.get(url)
            logger.info("[BG] Dictionary API status: %s", r.status_code)
            if r.status_code != 200:
                logger.info("[BG] Non-200 response for '%s': %s", text, r.status_code)
                return
            data = r.json()
            if not data or not isinstance(data, list):
                logger.info("[BG] Unexpected data format for '%s': %s", text, type(data))
                return
            entry = data[0]
            # phonetic
            pron = None
            if "phonetics" in entry and entry["phonetics"]:
                for p in entry["phonetics"]:
                    if p and p.get("text"):
                        pron = p.get("text")
                        break
            # definition
            definition = None
            meanings = entry.get("meanings") or []
            for m in meanings:
                defs = m.get("definitions") or []
                if defs:
                    d = defs[0].get("definition")
                    if d:
                        definition = d
                        break

            logger.info("[BG] Found pronunciation=%r definition=%r", pron, (definition[:120] + '...') if definition and len(definition) > 120 else definition)

            # update DB
            session = Session(bind=engine)
            try:
                obj = session.query(Word).filter(Word.id == word_id).first()
                if not obj:
                    logger.warning("[BG] Word id=%s not found in DB", word_id)
                    return
                if pron:
                    obj.pronunciation = pron
                if definition:
                    obj.definition = definition
                session.add(obj)
                session.commit()
                logger.info("[BG] Updated word id=%s in DB", word_id)
            finally:
                session.close()
    except Exception as e:
        logger.exception("[BG] Exception while fetching/updating word id=%s: %s", word_id, e)
        return
