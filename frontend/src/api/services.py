import requests
from bs4 import BeautifulSoup
from .models import LegalUpdate

def crawl_legal_news():
    url = "https://search.naver.com/search.naver?where=news&query=청년+법률+정책+개정&sort=1"
    headers = {"User-Agent": "Mozilla/5.0"}
    
    response = requests.get(url, headers=headers)
    soup = BeautifulSoup(response.text, 'html.parser')
    news_items = soup.select('.news_area')
    
    for item in news_items[:6]: # 최신 뉴스 6개 추출
        title = item.select_one('.news_tit').text
        link = item.select_one('.news_tit')['href']
        summary = item.select_one('.news_dsc').text[:100] + "..."
        
        # 제목이 겹치지 않을 때만 저장 (영웅아, unique=True 설정했으니 get_or_create가 안전해)
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