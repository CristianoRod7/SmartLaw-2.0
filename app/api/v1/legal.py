from fastapi import APIRouter
from app.services.crawler import crawl_legal_news # 🚀 크롤러 불러오기

router = APIRouter()

@router.get("/legal-updates/")
async def get_legal_updates():
    # 실시간으로 네이버 뉴스를 긁어옵니다.
    news_data = crawl_legal_news()
    return {
        "status": "success",
        "data": news_data
    }