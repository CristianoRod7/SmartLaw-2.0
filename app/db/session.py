from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from sqlalchemy.orm import DeclarativeBase
from app.core.config import settings

# 비동기 포스트그레 엔진 생성
engine = create_async_engine(settings.DATABASE_URL, echo=True)

# 세션 팩토리 (DB랑 대화하는 창구)
AsyncSessionLocal = async_sessionmaker(
    bind=engine, 
    class_=AsyncSession, 
    expire_on_commit=False
)

# 모든 모델의 부모 클래스
class Base(DeclarativeBase):
    pass

# DB 세션 의존성 주입용 함수
async def get_db():
    async with AsyncSessionLocal() as session:
        yield session