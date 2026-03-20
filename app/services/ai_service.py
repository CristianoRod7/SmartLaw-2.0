import json
from google import genai
from google.genai import types # 💡 추가
from app.core.config import settings
from app.schemas.analysis import AnalysisResponse

class AIService:
    def __init__(self):
        self.client = genai.Client(api_key=settings.GEMINI_API_KEY)
        # 2026년 기준 가장 안정적인 모델 유지
        self.model_id = "gemini-2.5-flash" 

    async def analyze_contract_risk(self, contract_text: str) -> dict:
        prompt = f"""
        당신은 대한민국 전세 사기 예방 및 부동산 전문 변호사입니다. 
        당신의 임무는 제공된 계약서 텍스트에서 '임차인에게 치명적인 독소 조항'을 찾아내는 것입니다.

        [분석 지침]
        1. 논리적 단계: 먼저 계약의 종류(전세/월세/전대차)를 파악하고, 각 종류별 법적 보호 장치를 점검하세요.
        2. 위험 탐지: 근저당권, 선순위 채권, 미납 국세, 대항력 발생 시점, 특약 사항의 누락 여부를 집중 분석하세요.
        3. 형광펜 강조: 각 위험 요소 설명에서 임차인이 반드시 눈여겨봐야 할 '핵심 단어'를 추출하여 highlight_keywords에 넣으세요.
        4. 개인정보 보호: 이름, 전화번호, 상세 주소 등은 반드시 '***'로 마스킹하세요.

        [계약서 원문]
        {contract_text}

        반드시 한국어로, 법률적 근거를 바탕으로 친절하게 답변하세요.
        """

        try:
            # 💡 [핵심] JSON 출력 강제 설정
            response = self.client.models.generate_content(
                model=self.model_id,
                contents=prompt,
                config=types.GenerateContentConfig(
                    response_mime_type="application/json",
                    response_schema=AnalysisResponse # 💡 우리가 정의한 규격을 아예 주입!
                )
            )
            # 문자열로 온 JSON을 파이썬 딕셔너리로 변환
            return json.loads(response.text)
            
        except Exception as e:
            return {
                "score": 0,
                "summary": f"분석 중 오류 발생: {str(e)}",
                "risk_factors": [],
                "special_clauses": [],
                "final_verdict": "오류로 인해 분석을 완료하지 못했습니다."
            }

ai_service = AIService()