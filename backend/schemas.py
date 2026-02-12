"""
Pydantic スキーマ定義（リクエスト/レスポンス）
"""
from datetime import datetime
from typing import Optional
from pydantic import BaseModel


class WordCreate(BaseModel):
    """単語登録リクエスト"""
    text: str
    pageUrl: Optional[str] = None
    createdAt: Optional[str] = None
    # pronunciation/definition are optional and normally filled by backend
    pronunciation: Optional[str] = None
    definition: Optional[str] = None


class WordResponse(BaseModel):
    """単語レスポンス"""
    id: int
    text: str
    pronunciation: Optional[str] = None
    definition: Optional[str] = None
    pageUrl: Optional[str] = None
    createdAt: Optional[datetime] = None

    class Config:
        from_attributes = True


class WordListResponse(BaseModel):
    """単語一覧レスポンス"""
    words: list[WordResponse]
    total: int
