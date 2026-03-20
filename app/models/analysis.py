from sqlalchemy import Column, Integer, String, JSON, DateTime
from sqlalchemy.sql import func
from app.db.session import Base

class AnalysisRecord(Base):
    __tablename__ = "analysis_records"

    id = Column(Integer, primary_key=True, index=True)
    filename = Column(String, nullable=False)
    # 💡 AI가 분석한 JSON 데이터를 통째로 저장 (score, risk_factors 등)
    analysis_result = Column(JSON, nullable=False) 
    created_at = Column(DateTime(timezone=True), server_default=func.now())