"""
SQLAlchemy モデル定義
"""
from datetime import datetime
from sqlalchemy import Column, Integer, String, DateTime, Text
from database import Base


class Word(Base):
    """
    単語モデル
    """
    __tablename__ = "words"

    id = Column(Integer, primary_key=True, index=True)
    text = Column(String(500), nullable=False, index=True)
    page_url = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    def to_dict(self):
        return {
            "id": self.id,
            "text": self.text,
            "pageUrl": self.page_url,
            "createdAt": self.created_at.isoformat() if self.created_at else None,
        }
