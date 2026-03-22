from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    PROJECT_NAME: str = "NextLaw 2.0"
    DATABASE_URL: str
    GEMINI_API_KEY: str
    
    # 🚀 OpenAI API 키 (반드시 .env와 이름이 같아야 함)
    OPENAI_API_KEY: str 

    # 🚀 V2 전용 설정: .env 파일을 읽어오는 방식
    model_config = SettingsConfigDict(
        env_file=".env", 
        env_file_encoding='utf-8',
        extra='ignore' # 다른 변수가 있어도 에러 무시
    )

settings = Settings()