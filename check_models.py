from google import genai
import os
from dotenv import load_dotenv

load_dotenv()
client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

print("--- 영웅이의 API 키로 접근 가능한 모델 목록 ---")
try:
    # 필터링 없이 그냥 다 뽑아보기
    models = client.models.list()
    for m in models:
        # 모델의 이름(name) 속성만 출력
        print(f"✅ 모델명: {m.name}")
except Exception as e:
    print(f"❌ 목록 가져오기 실패: {e}")
    print("팁: API 키가 .env에 제대로 있는지, 혹은 키 자체가 유효한지 확인해봐!")