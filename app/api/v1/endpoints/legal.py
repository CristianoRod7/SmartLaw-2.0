from fastapi import APIRouter, Query
from app.services.crawler import crawl_news

router = APIRouter()


@router.get("/news")
def get_news(query: str = Query(None)):
    return {
        "status": "success",
        "query": query,
        "data": crawl_news(query)
    }