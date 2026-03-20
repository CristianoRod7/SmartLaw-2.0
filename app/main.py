from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
# 🚀 [핵심] 여기서 recommend를 불러와야 에러가 안 나!
from app.api.v1 import recommend, analyze , legal

app = FastAPI(title="NextLaw 2.0 API")

# 🌐 CORS 설정 (프론트엔드 통신 허용)
# 5173(Vite)에서 오는 요청을 8000(FastAPI)이 받아줄 수 있게 해줌
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # 개발 중에는 모든 도메인 허용
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 🛤️ 라우터 등록
# 여기서 recommend.router를 사용하기 때문에 상단 import가 필수야!
app.include_router(recommend.router, prefix="/api/v1/recommend", tags=["recommend"])
app.include_router(analyze.router, prefix="/api/v1/analyze", tags=["analyze"])
app.include_router(legal.router, prefix="/api/v1", tags=["legal"])
@app.get("/")
async def root():
    return {
        "status": "online",
        "message": "NextLaw 2.0 API Server is running",
        "version": "2.0.0"
    }

# 서버 실행 확인 로그 (터미널에서 확인용)
print("✅ NextLaw 2.0 백엔드 엔진 가동 시작!")
print("🚀 API 주소: http://localhost:8000/api/v1/recommend/")