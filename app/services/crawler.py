import os
import re
from datetime import datetime, timezone, timedelta
from pathlib import Path

import requests
from dotenv import load_dotenv

BASE_DIR = Path(__file__).resolve().parents[2]
load_dotenv(BASE_DIR / ".env")


CATEGORY_RULES = {
    "스마트팜": {
        "queries": ["스마트팜", "시설원예", "온실 자동화", "스마트농업"],
        "keywords": ["스마트팜", "스마트농업", "시설원예", "온실", "생육", "환경제어", "양액", "팜", "농업기술"],
        "exclude": ["연예", "야구", "축구", "주식", "코인", "게임"],
        "impact": "스마트팜 구축 및 운영 리스크 확인 필요",
        "tag": "SMART",
    },
    "보조금": {
        "queries": ["농업 보조금", "청년농 지원사업", "농림축산식품부 지원금", "스마트팜 보조금"],
        "keywords": ["보조금", "지원금", "지원사업", "환수", "국고", "지방비", "청년농", "창업농", "정부지원"],
        "exclude": ["장학금", "영화", "공연"],
        "impact": "지원금 환수 및 의무 불이행 리스크 확인 필요",
        "tag": "SMART",
    },
    "농지/임대차": {
        "queries": ["농지 임대차", "농지법", "농지 전대", "농지 임대"],
        "keywords": ["농지", "임대차", "전대", "임대", "임차", "농지법", "사용대차", "경작"],
        "exclude": ["아파트", "오피스텔", "빌라", "상가"],
        "impact": "농지 사용 및 계약 리스크 점검 필요",
        "tag": "SMART",
    },
    "노동": {
        "queries": ["근로정책", "노동정책", "최저임금", "근로기준법"],
        "keywords": ["근로", "노동", "임금", "퇴직금", "해고", "최저임금", "수당", "고용", "근로기준법"],
        "exclude": ["야구", "축구", "연예"],
        "impact": "노무 리스크 점검 필요",
        "tag": "NEW",
    },
    "주거": {
        "queries": ["전세 정책", "월세 정책", "주거 지원", "임대차 보호법"],
        "keywords": ["주거", "전세", "월세", "보증금", "주택", "아파트", "임대차보호법"],
        "exclude": ["농지", "스마트팜"],
        "impact": "주거 계약 리스크 확인 필요",
        "tag": "LIVE",
    },
}

GENERIC_EXCLUDE = ["연예", "아이돌", "프로야구", "KBO", "축구", "e스포츠", "주가", "코인", "비트코인", "게임"]


def clean_html(text: str) -> str:
    if not text:
        return ""
    text = re.sub(r"</?b>", "", text)
    text = re.sub(r"<[^>]+>", "", text)
    return text.strip()


def parse_pub_date(pub_date_raw: str):
    if not pub_date_raw:
        return None
    try:
        return datetime.strptime(pub_date_raw, "%a, %d %b %Y %H:%M:%S %z")
    except Exception:
        return None


def fetch_naver_news(query: str, client_id: str, client_secret: str):
    url = "https://openapi.naver.com/v1/search/news.json"
    headers = {
        "X-Naver-Client-Id": client_id,
        "X-Naver-Client-Secret": client_secret,
    }
    params = {
        "query": query,
        "display": 10,
        "start": 1,
        "sort": "date",
    }

    response = requests.get(url, headers=headers, params=params, timeout=8)
    print(f"📡 API 상태: {response.status_code} | 검색어: {query}")
    data = response.json()
    return data.get("items", [])


def score_article(title: str, summary: str, category: str):
    text = f"{title} {summary}".lower()
    rule = CATEGORY_RULES[category]

    score = 0

    for kw in rule["keywords"]:
        if kw.lower() in text:
            score += 3 if kw.lower() in title.lower() else 1

    for bad in rule["exclude"]:
        if bad.lower() in text:
            score -= 4

    for bad in GENERIC_EXCLUDE:
        if bad.lower() in text:
            score -= 5

    return score


def detect_best_category(title: str, summary: str):
    best_category = "일반"
    best_score = -999

    for category in CATEGORY_RULES:
        score = score_article(title, summary, category)
        if score > best_score:
            best_score = score
            best_category = category

    return best_category, best_score


def build_search_queries(user_query: str | None):
    if user_query and user_query.strip():
        return [user_query.strip()]

    queries = []
    for category in CATEGORY_RULES.values():
        queries.extend(category["queries"])

    return queries


def crawl_news(query: str = None, days: int = 180):
    client_id = os.getenv("NAVER_CLIENT_ID")
    client_secret = os.getenv("NAVER_CLIENT_SECRET")

    if not client_id or not client_secret:
        return [
            {
                "id": "mock-no-api-key",
                "category": "시스템",
                "tag": "INFO",
                "title": "네이버 뉴스 API 키가 설정되지 않았습니다.",
                "summary": "NAVER_CLIENT_ID / NAVER_CLIENT_SECRET 환경변수를 확인해주세요.",
                "impact": "API 인증 필요",
                "date": "Today",
                "link": None,
                "score": 0,
            }
        ]

    cutoff = datetime.now(timezone.utc) - timedelta(days=days)
    search_queries = build_search_queries(query)

    all_items = []
    for q in search_queries:
        try:
            items = fetch_naver_news(q, client_id, client_secret)
            all_items.extend(items)
        except Exception as e:
            print(f"❌ 개별 검색 실패 | query={q} | error={e}")

    print(f"📰 API 원본 뉴스 총합: {len(all_items)}")

    results = []
    seen_links = set()
    idx = 0

    for item in all_items:
        title = clean_html(item.get("title", ""))
        summary = clean_html(item.get("description", ""))
        link = item.get("originallink") or item.get("link")
        pub_date_raw = item.get("pubDate", "")
        pub_date = parse_pub_date(pub_date_raw)

        if not title or not pub_date:
            continue

        if pub_date.astimezone(timezone.utc) < cutoff:
            continue

        if link and isinstance(link, str) and link.startswith("http"):
            dedupe_key = link
        else:
            dedupe_key = f"{title}-{pub_date_raw}"
            link = None

        if dedupe_key in seen_links:
            continue
        seen_links.add(dedupe_key)

        category, score = detect_best_category(title, summary)

        # 관련도 너무 낮으면 버림
        if score < 2:
            continue

        rule = CATEGORY_RULES.get(category, None)
        impact = rule["impact"] if rule else "정책 변화 확인 필요"
        tag = rule["tag"] if rule else "LIVE"

        results.append({
            "id": f"news-{idx}",
            "category": category,
            "tag": tag,
            "title": title,
            "summary": summary[:120] + "..." if len(summary) > 120 else summary,
            "impact": impact,
            "date": pub_date.strftime("%Y-%m-%d"),
            "link": link,
            "score": score,
        })
        idx += 1

    # 관련도 우선, 그다음 최신순
    results.sort(key=lambda x: (x["score"], x["date"]), reverse=True)

    print(f"✅ 관련도 필터 후 최종 반환 뉴스 개수: {len(results)}")

    if not results:
        return [
            {
                "id": "mock-1",
                "category": "시스템",
                "tag": "INFO",
                "title": "해당 조건에 맞는 정책 데이터를 찾지 못했습니다.",
                "summary": "검색어를 바꾸거나 기간 조건을 완화해 다시 시도해주세요.",
                "impact": "검색 결과 없음",
                "date": "Today",
                "link": None,
                "score": 0,
            }
        ]

    return results[:12]