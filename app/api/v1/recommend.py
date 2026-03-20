from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import httpx
import os
from typing import List

router = APIRouter()

GOOGLE_MAPS_API_KEY = os.getenv("VITE_GOOGLE_MAPS_API_KEY")

class RecommendRequest(BaseModel):
    work_lat: float
    work_lng: float
    max_budget: int
    max_time: int

# 🏠 전국 주요 거점 시드 데이터 (서울, 경기, 인천, 부산, 대구, 대전, 광주, 울산, 제주)
NEIGHBORHOODS = [
    # --- 서울/수도권 ---
    {"name": "서울 마포구 아현동", "lat": 37.5515, "lng": 126.9510, "avg_price": 85000, "safety_rank": 94},
    {"name": "서울 성동구 옥수동", "lat": 37.5418, "lng": 127.0175, "avg_price": 95000, "safety_rank": 96},
    {"name": "경기 수원시 영통동", "lat": 37.2512, "lng": 127.0713, "avg_price": 45000, "safety_rank": 92},
    {"name": "경기 성남시 판교동", "lat": 37.3947, "lng": 127.1111, "avg_price": 110000, "safety_rank": 98},
    {"name": "인천 연수구 송도동", "lat": 37.3851, "lng": 126.6433, "avg_price": 55000, "safety_rank": 95},
    
    # --- 경상권 ---
    {"name": "부산 해운대구 우동", "lat": 35.1631, "lng": 129.1390, "avg_price": 65000, "safety_rank": 93},
    {"name": "부산 부산진구 전포동", "lat": 35.1555, "lng": 129.0667, "avg_price": 35000, "safety_rank": 88},
    {"name": "대구 수성구 범어동", "lat": 35.8587, "lng": 128.6253, "avg_price": 58000, "safety_rank": 94},
    {"name": "울산 남구 신정동", "lat": 35.5396, "lng": 129.3115, "avg_price": 38000, "safety_rank": 90},
    
    # --- 충청/전라/제주 ---
    {"name": "대전 유성구 상대동", "lat": 36.3392, "lng": 127.3297, "avg_price": 42000, "safety_rank": 91},
    {"name": "광주 남구 봉선동", "lat": 35.1242, "lng": 126.9090, "avg_price": 48000, "safety_rank": 92},
    {"name": "세종시 나성동", "lat": 36.4834, "lng": 127.2612, "avg_price": 52000, "safety_rank": 97},
    {"name": "제주 제주시 노형동", "lat": 33.4851, "lng": 126.4812, "avg_price": 45000, "safety_rank": 93},
]

@router.post("/")
async def recommend_housing(req: RecommendRequest):
    if not GOOGLE_MAPS_API_KEY:
        raise HTTPException(status_code=500, detail="API Key missing")

    results = []
    async with httpx.AsyncClient() as client:
        for spot in NEIGHBORHOODS:
            if spot["avg_price"] > req.max_budget:
                continue

            url = f"https://maps.googleapis.com/maps/api/distancematrix/json?origins={req.work_lat},{req.work_lng}&destinations={spot['lat']},{spot['lng']}&mode=transit&key={GOOGLE_MAPS_API_KEY}"
            
            try:
                resp = await client.get(url)
                data = resp.json()
                if data["status"] == "OK" and data["rows"][0]["elements"][0]["status"] == "OK":
                    duration_min = data["rows"][0]["elements"][0]["duration"]["value"] // 60
                    if duration_min <= req.max_time:
                        score = int((1 - (duration_min / req.max_time)) * 60 + (spot["safety_rank"] / 100) * 40)
                        results.append({
                            **spot,
                            "time": duration_min,
                            "score": score,
                            "desc": f"직장에서 {duration_min}분 거리이며, 해당 지역 평균 시세를 반영한 결과입니다."
                        })
            except Exception:
                continue

    return {"status": "success", "data": sorted(results, key=lambda x: x["score"], reverse=True)}