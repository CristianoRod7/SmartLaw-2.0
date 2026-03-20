import requests
from bs4 import BeautifulSoup
from sqlalchemy.orm import Session
from app.models.legal import LegalUpdate

def crawl_and_save_news(db: Session):
    url = "https://search.naver.com/search.naver?where=news&query=청년+법률+정책+개정&sort=1"
    headers = {"User-Agent": "Mozilla/5.0"}
    
    response = requests.get(url, headers=headers)
    soup = BeautifulSoup(response.text, 'html.parser')
    news_items = soup.select('.news_area')
    
    for item in news_items[:6]:
        title = item.select_one('.news_tit').text
        link = item.select_one('.news_tit')['href']
        summary = item.select_one('.news_dsc').text[:100] + "..."
        
        # 중복 체크 후 저장
        db_item = db.query(LegalUpdate).filter(LegalUpdate.title == title).first()
        if not db_item:
            new_update = LegalUpdate(
                category="최신 정책",
                tag="LIVE",
                title=title,
                summary=summary,
                impact="청년 권익 보호 및 혜택 확인 필요",
                link=link
            )
            db.add(new_update)
    db.commit()