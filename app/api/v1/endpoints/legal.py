from fastapi import APIRouter, Query
from app.services.crawler import crawl_news

router = APIRouter()


@router.get("/news")
def get_news(
    query: str = Query(None),
    days: int = Query(180)
):
    return {
        "status": "success",
        "query": query,
        "days": days,
        "data": crawl_news(query, days)
    }