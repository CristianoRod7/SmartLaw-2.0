import requests
from bs4 import BeautifulSoup


def classify_news(title: str, summary: str):
    text = f"{title} {summary}"

    if any(k in text for k in ["보조금", "지원금", "환수"]):
        return "보조금", "SMART", "지원금 환수 및 의무 불이행 리스크 확인 필요"

    if any(k in text for k in ["농지", "임대차", "전대"]):
        return "농지/임대차", "SMART", "농지 사용 및 계약 리스크 점검 필요"

    if any(k in text for k in ["스마트팜", "시설원예", "온실"]):
        return "스마트팜", "SMART", "스마트팜 구축 및 운영 리스크 확인 필요"

    if any(k in text for k in ["주거", "전세", "월세"]):
        return "주거", "LIVE", "주거 계약 리스크 확인 필요"

    if any(k in text for k in ["근로", "노동", "임금"]):
        return "노동", "NEW", "노무 리스크 점검 필요"

    return "최신 뉴스", "LIVE", "정책 변화 확인 필요"


def crawl_news(query: str = None):
    # 👉 기본값 (검색 안 했을 때)
    if not query:
        query = "스마트팜 정책"

    url = f"https://search.naver.com/search.naver?where=news&query={query}&sort=1"

    headers = {
        "User-Agent": "Mozilla/5.0",
        "Referer": "https://www.naver.com/"
    }

    try:
        response = requests.get(url, headers=headers, timeout=5)
        print(f"📡 상태: {response.status_code} | 검색어: {query}")

        soup = BeautifulSoup(response.text, "html.parser")
        news_items = soup.select("ul.list_news > li.bx")

        results = []

        for i, item in enumerate(news_items[:5]):
            tit = item.select_one(".news_tit")
            dsc = item.select_one(".news_dsc")

            if not tit:
                continue

            title = tit.text.strip()
            summary = dsc.text.strip()[:100] + "..." if dsc else ""

            category, tag, impact = classify_news(title, summary)

            results.append({
                "id": f"news-{i}",
                "category": category,
                "tag": tag,
                "title": title,
                "summary": summary,
                "impact": impact,
                "date": "Today",
                "link": tit.get("href")
            })

        # 👉 fallback
        if not results:
            return [
                {
                    "id": "mock-1",
                    "category": "스마트팜",
                    "tag": "SMART",
                    "title": "스마트팜 지원 확대",
                    "summary": "정부 지원 확대 예정",
                    "impact": "비용 절감 가능",
                    "date": "Today",
                    "link": "#"
                }
            ]

        return results

    except Exception as e:
        print("❌ 크롤링 에러:", e)
        return []