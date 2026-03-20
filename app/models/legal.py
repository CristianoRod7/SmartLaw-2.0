from sqlalchemy import Column, Integer, String, Text, DateTime
from datetime import datetime
from app.db.base_class import Base # 네 프로젝트의 Base 위치 확인!

class LegalUpdate(Base):
    __tablename__ = "legal_updates"

    id = Column(Integer, primary_key=True, index=True)
    category = Column(String(50))
    tag = Column(String(20))
    title = Column(String(200), unique=True, index=True)
    summary = Column(Text)
    impact = Column(String(200))
    link = Column(String(500))
    created_at = Column(DateTime, default=datetime.utcnow)