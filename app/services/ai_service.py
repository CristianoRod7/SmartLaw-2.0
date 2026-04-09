import json
from google import genai
from app.core.config import settings
import asyncio
from app.prompts.base_system import SYSTEM_PERSONA
from app.prompts.industry_it import IT_SCAN_PROMPT
from app.prompts.industry_farm import FARM_SCAN_PROMPT
from app.prompts.industry_real_estate import REAL_ESTATE_SCAN_PROMPT
from fastapi import HTTPException


class AIService:
    def __init__(self):
        api_key = getattr(settings, "GEMINI_API_KEY", None) or getattr(settings, "GOOGLE_API_KEY", None)

        self.client = None
        self.model_candidates = [
            "gemini-2.5-flash",
            "gemini-flash-latest",
            "gemini-2.5-flash-lite",
            "gemini-flash-lite-latest",
            "gemini-2.0-flash",
            "gemini-2.0-flash-lite",
        ]

        if api_key and api_key != "mock_key":
            self.client = genai.Client(api_key=api_key)

    def _get_industry_prompt(self, industry: str) -> str:
        industry = (industry or "").lower().strip()

        industry_map = {
            "it": IT_SCAN_PROMPT,
            "smartfarm": FARM_SCAN_PROMPT,
            "real_estate": REAL_ESTATE_SCAN_PROMPT,
        }

        return industry_map.get(
            industry,
            "대한민국 민법 및 일반 계약 기준으로 사용자에게 불리한 불공정 조항과 법적 리스크를 분석해."
        )

    async def _generate_json(self, prompt: str) -> dict:
        if not self.client:
            raise HTTPException(status_code=503, detail="Gemini API 키가 설정되지 않았습니다.")

        last_error = None

        for model_name in self.model_candidates:
            for attempt in range(3):
                try:
                    response = await self.client.aio.models.generate_content(
                        model=model_name,
                        contents=prompt,
                        config={
                            "temperature": 0.1,
                            "response_mime_type": "application/json",
                        }
                    )

                    if not response.text:
                        raise HTTPException(status_code=503, detail="AI 응답이 비어 있습니다.")

                    return json.loads(response.text)

                except json.JSONDecodeError as e:
                    print(f"❌ JSON 파싱 오류: {e}")
                    raise HTTPException(status_code=503, detail="AI 응답 파싱 실패")

                except Exception as e:
                    last_error = e
                    print(f"❌ Gemini 호출 오류 | 모델: {model_name} | 시도 {attempt + 1}/3 | {e}")

                    error_text = str(e).lower()
                    if "503" in error_text or "unavailable" in error_text or "high demand" in error_text:
                        if attempt < 2:
                            await asyncio.sleep(2 * (attempt + 1))
                            continue
                        break

                    raise HTTPException(status_code=503, detail=f"AI 분석 실패: {str(e)}")

        raise HTTPException(status_code=503, detail=f"AI 분석 실패: {str(last_error)}")

    async def analyze_contract_risk(
        self,
        contract_text: str,
        document_type: str = "일반 계약서",
        industry: str = "general"
    ) -> dict:
        industry_guide = self._get_industry_prompt(industry)

        prompt = f"""
{SYSTEM_PERSONA}

[산업 분야]
{industry}

[문서 유형]
{document_type}

[산업별 분석 가이드]
{industry_guide}

[정밀 분석 지시사항]
1. 위 지식을 바탕으로 아래 계약서 텍스트를 정밀 스캔해.
2. 유저에게 치명적인 독소 조항을 우선 찾아내.
3. 산업 특성에 맞는 리스크를 우선 반영해.
4. 법적 근거가 있으면 관련 법령 또는 조항명을 함께 제시해.
5. 분석 결과는 반드시 아래 JSON 포맷만 유지해.

[출력 JSON 포맷]
{{
  "score": 0,
  "summary": "산업적 관점에서의 종합 리스크 평가 2~3문장",
  "sections": [
    {{
      "category": "분석 카테고리",
      "icon_type": "ShieldAlert",
      "items": [
        {{
          "page": "숫자",
          "line": "숫자 또는 조항번호",
          "clause": "문제 키워드",
          "status": "Safe/Warning/Danger",
          "title": "진단 제목",
          "desc": "구체적 문제 설명",
          "law": "관련 법령",
          "tip": "수정 제안 가이드"
        }}
      ]
    }}
  ]
}}

[분석 대상 계약서 텍스트]
{contract_text}
"""
        return await self._generate_json(prompt)

    async def simulate_smartfarm_risk(
        self,
        contract_text: str,
        contract_type: str,
        land_type: str,
        subsidy: str,
        investment: str,
        outsourcing: str,
        operator: str
    ) -> dict:
        prompt = f"""
너는 스마트팜 계약 및 농지법, 보조금 정책을 분석하는 전문 컨설턴트다.

[입력 데이터]
- 계약 유형: {contract_type}
- 농지 형태: {land_type}
- 보조금 여부: {subsidy}
- 투자 규모: {investment}
- 외주 여부: {outsourcing}
- 운영 주체: {operator}

[계약서 내용]
{contract_text}

[분석 목표]
1. 현재 리스크 평가
2. 6개월 후 발생 가능한 리스크
3. 1년 후 발생 가능한 리스크
4. 예상 피해 규모
5. 반드시 해야 할 조치 3가지

[출력 JSON 형식]
{{
  "score": 0,
  "summary": "현재 상태 요약",
  "future_risk": {{
    "6_months": [
      {{
        "issue": "문제명",
        "probability": "낮음/중간/높음",
        "impact": "예상 피해",
        "reason": "원인"
      }}
    ],
    "1_year": [
      {{
        "issue": "문제명",
        "probability": "낮음/중간/높음",
        "impact": "예상 피해",
        "reason": "원인"
      }}
    ]
  }},
  "actions": [
    "조치 1",
    "조치 2",
    "조치 3"
  ]
}}
"""
        return await self._generate_json(prompt)


ai_service = AIService()