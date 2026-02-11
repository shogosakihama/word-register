"""
データベース接続設定
"""
import os
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# 環境変数からDB URLを取得（デフォルトはDocker Compose用）
DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "postgresql://wordapp:wordapp@db:5432/wordapp"
)

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()


def get_db():
    """
    FastAPI Dependency: DBセッションを取得
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
