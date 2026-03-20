import os
from pydantic_settings import BaseSettings, SettingsConfigDict

# 1. 클래스 정의 전에 경로를 먼저 확실하게 잡아주기 (Scope 문제 해결)
# 프로젝트 루트 폴더에 있는 .env 파일을 가리킴
BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
ENV_FILE_PATH = os.path.join(BASE_DIR, ".env")

class Settings(BaseSettings):
    # 필수 변수들
    PROJECT_NAME: str = "NextLaw"
    VERSION: str = "2.0.0"
    API_V1_STR: str = "/api/v1"
    
    # DB 및 API 키 (None 에러 방지를 위해 기본값 생략 가능하지만 .env에서 읽어와야 함)
    DATABASE_URL: str
    GEMINI_API_KEY: str

    # Pydantic V2 설정 방식
    model_config = SettingsConfigDict(
        env_file=ENV_FILE_PATH,  # 아까 에러 난 부분 해결!
        env_file_encoding="utf-8",
        case_sensitive=True,
        extra="ignore"
    )

# 싱글톤 인스턴스 생성
settings = Settings()

# 🚀 [디버깅용] 서버 켤 때 주소 잘 읽었는지 터미널에 찍어줌
print(f"✅ DB 주소 로드 완료: {settings.DATABASE_URL[:15]}...")