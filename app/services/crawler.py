import os
import re
from datetime import datetime, timezone, timedelta
from email.utils import parsedate_to_datetime
from pathlib import Path
from urllib.parse import quote_plus
import xml.etree.ElementTree as ET

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
    "IT/개발외주": {
        "queries": ["IT 외주 계약", "소프트웨어 개발 계약", "프리랜서 용역 계약", "개발자 유지보수 계약", "NDA 비밀유지 계약"],
        "keywords": ["IT", "개발", "외주", "프리랜서", "용역", "소프트웨어", "앱", "웹", "유지보수", "하자보수", "소스코드", "저작권", "검수", "NDA", "비밀유지"],
        "exclude": ["게임", "연예", "스포츠"],
        "impact": "외주 개발 계약의 대금·검수·IP 리스크 점검 필요",
        "tag": "IT",
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
        parsed = parsedate_to_datetime(pub_date_raw)
        if parsed.tzinfo is None:
            return parsed.replace(tzinfo=timezone.utc)
        return parsed
    except Exception:
        return None


def fetch_naver_news(query: str, client_id: str, client_secret: str):
    url = "https://openapi.naver.com/v1/search/news.json"
    headers = {
        "X-Naver-Client-Id": client_id,
        "X-Naver-Client-Secret": client_secret,
        "User-Agent": "Mozilla/5.0 (compatible; NextLawCrawler/1.0)",
    }
    params = {
        "query": query,
        "display": 10,
        "start": 1,
        "sort": "date",
    }

    try:
        response = requests.get(url, headers=headers, params=params, timeout=8)
        print(f"📡 Naver API 상태: {response.status_code} | 검색어: {query}")
        response.raise_for_status()

        try:
            data = response.json()
        except ValueError as e:
            print(f"❌ Naver JSON 파싱 실패 | query={query} | error={e}")
            return []

        if data.get("errorMessage"):
            print(
                "❌ Naver API 오류 "
                f"| query={query} | code={data.get('errorCode')} | message={data.get('errorMessage')}"
            )
            return []

        return data.get("items", [])

    except requests.RequestException as e:
        print(f"❌ Naver 뉴스 요청 실패 | query={query} | error={e}")
        return []


def fetch_google_news_rss(query: str):
    encoded_query = quote_plus(f"{query} 법률 정책")
    url = f"https://news.google.com/rss/search?q={encoded_query}&hl=ko&gl=KR&ceid=KR:ko"
    headers = {
        "User-Agent": "Mozilla/5.0 (compatible; NextLawLocalCrawler/1.0)",
    }

    response = requests.get(url, headers=headers, timeout=8)
    response.raise_for_status()

    root = ET.fromstring(response.content)
    items = []
    for item in root.findall("./channel/item")[:10]:
        title = item.findtext("title", default="")
        summary = item.findtext("description", default="")
        link = item.findtext("link", default="")
        pub_date = item.findtext("pubDate", default="")
        items.append({
            "title": title,
            "description": summary,
            "originallink": link,
            "link": link,
            "pubDate": pub_date,
        })

    print(f"📡 Google RSS 수집: {len(items)}건 | 검색어: {query}")
    return items


def fallback_news_items(query: str | None = None):
    today = datetime.now(timezone.utc).strftime("%Y-%m-%d")
    items = [
        {
            "id": "fallback-smartfarm",
            "category": "스마트팜",
            "tag": "SMART",
            "title": "스마트팜 계약 점검 체크리스트",
            "summary": "로컬 크롤링 연결이 실패해 기본 안내를 표시합니다. 구축 범위, 검수 기준, 하자보수, 보조금 환수 조항을 우선 확인하세요.",
            "impact": "스마트팜 구축 및 운영 리스크 확인 필요",
            "date": today,
            "link": None,
            "score": 0,
        },
        {
            "id": "fallback-lease",
            "category": "주거",
            "tag": "LIVE",
            "title": "임대차 계약 점검 체크리스트",
            "summary": "보증금 반환, 확정일자, 수선 의무, 특약 조항을 확인하세요. 실제 최신 뉴스는 네트워크 또는 API 키 설정 후 다시 조회할 수 있습니다.",
            "impact": "주거 계약 리스크 확인 필요",
            "date": today,
            "link": None,
            "score": 0,
        },
        {
            "id": "fallback-subsidy",
            "category": "보조금",
            "tag": "SMART",
            "title": "보조금 환수 리스크 점검 체크리스트",
            "summary": "지원사업 목적 외 사용, 의무 운영기간 위반, 증빙 누락은 환수 사유가 될 수 있으니 계약서와 사업지침을 함께 확인하세요.",
            "impact": "지원금 환수 및 의무 불이행 리스크 확인 필요",
            "date": today,
            "link": None,
            "score": 0,
        },
        {
            "id": "fallback-labor",
            "category": "노동",
            "tag": "NEW",
            "title": "근로계약·임금 조항 점검 체크리스트",
            "summary": "근로시간, 휴게시간, 연장근로수당, 퇴직금, 해고 예고 조항이 근로기준법 취지에 맞는지 확인하세요.",
            "impact": "노무 리스크 점검 필요",
            "date": today,
            "link": None,
            "score": 0,
        },
        {
            "id": "fallback-it-outsourcing",
            "category": "IT/개발외주",
            "tag": "IT",
            "title": "IT 외주 계약 점검 체크리스트",
            "summary": "대금 지급, 검수 기준, 추가 개발 범위, IP 이전 시점, 유지보수 책임, 오픈소스 라이선스 조항을 확인하세요.",
            "impact": "외주 개발 계약의 대금·검수·IP 리스크 점검 필요",
            "date": today,
            "link": None,
            "score": 0,
        },
    ]

    if query:
        query_text = query.lower()

        def match_priority(item):
            category = item["category"].lower()
            title = item["title"].lower()
            summary = item["summary"].lower()

            if query_text in category:
                return 0
            if query_text in title:
                return 1
            if query_text in summary:
                return 2
            return 99

        matched_items = [item for item in items if match_priority(item) < 99]
        return sorted(matched_items, key=match_priority) or items

    return items


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

    cutoff = datetime.now(timezone.utc) - timedelta(days=days)
    search_queries = build_search_queries(query)

    all_items = []
    for q in search_queries:
        try:
            if client_id and client_secret:
                items = fetch_naver_news(q, client_id, client_secret)
            else:
                items = fetch_google_news_rss(q)
            all_items.extend(items)
        except Exception as e:
            print(f"❌ 개별 검색 실패 | query={q} | error={e}")
            if client_id and client_secret:
                try:
                    all_items.extend(fetch_google_news_rss(q))
                except Exception as rss_error:
                    print(f"❌ RSS 대체 검색 실패 | query={q} | error={rss_error}")

    print(f"📰 원본 뉴스 총합: {len(all_items)}")

    if not all_items:
        return fallback_news_items(query)

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
        return fallback_news_items(query)

    return results[:12]
