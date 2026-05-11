from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    PROJECT_NAME: str = "NextLaw 2.0"
    DATABASE_URL: str = "postgresql+asyncpg://user:password@localhost:5432/nextlaw"
    GEMINI_API_KEY: str = ""
    GOOGLE_API_KEY: str = ""
    OPENAI_API_KEY: str = ""
    OPENAI_MODEL: str = "gpt-4.1-mini"
    
    # 🚀 [여기 추가!!] Pydantic아, 네이버 키도 같이 읽어와라!
    NAVER_CLIENT_ID: str = ""
    NAVER_CLIENT_SECRET: str = ""

    # 🚀 V2 전용 설정: .env 파일을 읽어오는 방식
    model_config = SettingsConfigDict(
        env_file=".env", 
        env_file_encoding='utf-8',
        extra='ignore' # 다른 변수가 있어도 에러 무시
    )

settings = Settings()