import requests
from bs4 import BeautifulSoup
from .models import LegalUpdate

def crawl_legal_news():
    # 1. 네이버 뉴스 검색 결과 페이지 접속
    url = "https://search.naver.com/search.naver?where=news&query=청년+법률+정책+개정&sort=1"
    headers = {"User-Agent": "Mozilla/5.0"} # 차단 방지용 이름표
    
    response = requests.get(url, headers=headers)
    soup = BeautifulSoup(response.text, 'html.parser')
    
    # 2. 뉴스 기사 묶음 찾기
    news_items = soup.select('.news_area')
    
    # 3. 데이터 6개만 긁어서 DB에 넣기
    for item in news_items[:6]:
        title = item.select_one('.news_tit').text
        link = item.select_one('.news_tit')['href']
        summary = item.select_one('.news_dsc').text[:100] + "..."
        
        # 중복 방지: 이미 있는 제목은 건너뛰고 없으면 저장
        LegalUpdate.objects.get_or_create(
            title=title,
            defaults={
                "category": "최신 정책",
                "tag": "LIVE",
                "summary": summary,
                "impact": "청년 권익 보호 및 혜택 확인 필요",
                "link": link
            }
        )