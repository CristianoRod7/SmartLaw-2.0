from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
import time

from app.api.v1.endpoints.analyze import router as analyze_router
from app.api.v1.endpoints.legal import router as legal_router
from app.api.v1.endpoints.chat import router as chat_router



app = FastAPI(title="NextLaw 2.0 API")
app.include_router(analyze_router, prefix="/api/v1/analyze", tags=["analyze"])
app.include_router(legal_router, prefix="/api/v1/legal", tags=["legal"])
app.include_router(chat_router, prefix="/api/v1/chat", tags=["chat"])

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.middleware("http")
async def log_requests(request: Request, call_next):
    start_time = time.time()
    response = await call_next(request)
    duration = time.time() - start_time
    print(f"📡 [LOG] {request.method} {request.url.path} - Status: {response.status_code} ({duration:.2f}s)")
    return response


@app.get("/")
async def root():
    return {
        "status": "online",
        "message": "NextLaw 2.0 API Server is running perfectly!",
        "version": "2.0.0"
    }

print("✅ NextLaw Hub 백엔드 엔진 가동 시작!")
print("🚀 API 서버 주소: http://localhost:8000")
print("📖 API 문서 주소: http://localhost:8000/docs")