from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.api import deps # 네 프로젝트의 get_db 위치 확인!
from app.services.legal_service import crawl_and_save_news
from app.models.legal import LegalUpdate

router = APIRouter()

@router.get("/updates")
def get_legal_updates(db: Session = Depends(deps.get_db)):
    # 1. API 호출 시 실시간 크롤링 실행
    crawl_and_save_news(db)
    
    # 2. DB에서 데이터 6개 가져오기
    updates = db.query(LegalUpdate).order_by(LegalUpdate.created_at.desc()).limit(6).all()
    return {"status": "success", "data": updates}