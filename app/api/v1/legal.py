from fastapi import APIRouter
import requests
from app.core.config import settings # 🚀 똑똑한 Pydantic 불러오기!

router = APIRouter()

@router.get("/legal-updates/")
async def get_legal_updates():
    # 🚀 settings에서 안전하게 땡겨오기 (공백 찌꺼기 제거 완벽 적용)
    NAVER_CLIENT_ID = getattr(settings, "NAVER_CLIENT_ID", "").strip()
    NAVER_CLIENT_SECRET = getattr(settings, "NAVER_CLIENT_SECRET", "").strip()

    if not NAVER_CLIENT_ID or not NAVER_CLIENT_SECRET:
        print("🚨 삐용삐용: Pydantic도 네이버 키를 못 찾음! (.env 파일 안의 오타 100% 확정)")
        return {"status": "error", "message": "API 키가 설정되지 않았습니다."}

    query = "청년 법률 정책"
    url = f"https://openapi.naver.com/v1/search/news.json?query={query}&display=10&sort=sim"
    
    headers = {
        "X-Naver-Client-Id": NAVER_CLIENT_ID,
        "X-Naver-Client-Secret": NAVER_CLIENT_SECRET
    }

    try:
        response = requests.get(url, headers=headers)
        
        if response.status_code != 200:
            print(f"❌ 네이버 API 에러 발생! 상태코드: {response.status_code}")
            return {"status": "error", "data": [{"id": 0, "title": "뉴스 로딩 실패", "summary": f"에러코드: {response.status_code}", "tag": "에러"}]}

        items = response.json().get('items', [])
        processed_news = []
        for idx, item in enumerate(items):
            processed_news.append({
                "id": idx + 1,
                "category": "최신법률",
                "tag": "실시간",
                "title": item['title'].replace("<b>", "").replace("</b>", "").replace("&quot;", '"'),
                "summary": item['description'].replace("<b>", "").replace("</b>", "").replace("&quot;", '"'),
                "link": item['link']
            })
        
        print(f"✅ 드디어 뚫었다!! 뉴스 {len(processed_news)}개 긁어오기 성공!")
        return {"status": "success", "data": processed_news}

    except Exception as e:
        print(f"🔥 서버 내부 에러 발생: {e}")
        return {"status": "error", "message": str(e)}