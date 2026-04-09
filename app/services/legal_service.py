import requests
from bs4 import BeautifulSoup
from sqlalchemy.orm import Session
from app.core.config import settings


# --- [방법 1: 네이버 검색 API 사용 (추천/상용)] ---
def fetch_news_via_api():
    client_id = settings.NAVER_CLIENT_ID.strip()
    client_secret = settings.NAVER_CLIENT_SECRET.strip()
    url = "https://openapi.naver.com/v1/search/news.json?query=청년+법률+정책&display=10&sort=sim"
    headers = {
        "X-Naver-Client-Id": client_id,
        "X-Naver-Client-Secret": client_secret
    }

    try:
        response = requests.get(url, headers=headers, timeout=5)
        if response.status_code == 200:
            return response.json().get("items", [])
        print(f"❌ API 호출 실패: status={response.status_code}, body={response.text[:200]}")
    except Exception as e:
        print(f"❌ API 호출 실패: {e}")
    return []


# --- [방법 2: BeautifulSoup 크롤링 (백업용)] ---
def crawl_news_via_web():
    url = "https://search.naver.com/search.naver?where=news&query=청년+법률+정책+개정&sort=1"
    headers = {"User-Agent": "Mozilla/5.0"}

    try:
        response = requests.get(url, headers=headers, timeout=5)
        response.raise_for_status()
        soup = BeautifulSoup(response.text, "html.parser")
        return soup.select(".news_area")
    except Exception as e:
        print(f"❌ 크롤링 실패: {e}")
        return []


def _clean_html_text(text: str) -> str:
    if not text:
        return ""
    return text.replace("<b>", "").replace("</b>", "").strip()


def _normalize_api_item(item: dict, idx: int) -> dict:
    title = _clean_html_text(item.get("title", "제목 없음"))
    summary = _clean_html_text(item.get("description", ""))
    link = item.get("originallink") or item.get("link") or ""

    return {
        "id": idx + 1,
        "category": "최신 정책",
        "tag": "LIVE",
        "title": title,
        "summary": (summary[:100] + "...") if len(summary) > 100 else summary,
        "link": link,
    }


def _normalize_crawl_item(item, idx: int) -> dict | None:
    title_el = item.select_one(".news_tit")
    desc_el = item.select_one(".news_dsc")

    if not title_el:
        return None

    title = title_el.get_text(strip=True)
    summary = desc_el.get_text(strip=True) if desc_el else ""
    link = title_el.get("href", "")

    return {
        "id": idx + 1,
        "category": "최신 정책",
        "tag": "LIVE",
        "title": title,
        "summary": (summary[:100] + "...") if len(summary) > 100 else summary,
        "link": link,
    }


# --- [메인 서비스 로직: DB 저장 없이 바로 반환] ---
def sync_legal_updates(db: Session | None = None):
    """
    API 우선 시도 -> 실패 시 크롤링 -> 프론트에 바로 반환
    현재는 DB 저장 없이 동작하게 단순화한 버전
    """

    # 1. 네이버 검색 API 우선
    api_items = fetch_news_via_api()
    if api_items:
        updates = []
        seen_titles = set()

        for idx, item in enumerate(api_items):
            normalized = _normalize_api_item(item, idx)
            if normalized["title"] in seen_titles:
                continue
            seen_titles.add(normalized["title"])
            updates.append(normalized)

        return updates[:6]

    # 2. API 실패 시 웹 크롤링 백업
    news_items = crawl_news_via_web()
    updates = []
    seen_titles = set()

    for idx, item in enumerate(news_items[:10]):
        normalized = _normalize_crawl_item(item, idx)
        if not normalized:
            continue
        if normalized["title"] in seen_titles:
            continue
        seen_titles.add(normalized["title"])
        updates.append(normalized)

    return updates[:6]