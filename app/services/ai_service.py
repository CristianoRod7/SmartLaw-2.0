import json
import asyncio
from google import genai
from fastapi import HTTPException

from app.core.config import settings
from app.prompts.base_system import SYSTEM_PERSONA
from app.prompts.industry_it import IT_SCAN_PROMPT
from app.prompts.industry_farm import FARM_SCAN_PROMPT
from app.prompts.industry_real_estate import REAL_ESTATE_SCAN_PROMPT


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

    def _draft_document_chat_fallback(
        self,
        document_type: str,
        user_message: str,
        history: list[dict] | None = None
    ) -> str:
        """Return a deterministic local response when an AI key is not configured.

        This keeps the chatbot endpoint usable in local/dev environments and makes
        the missing-key cause visible in the UI instead of failing as a network
        error.
        """
        recent_context = ""
        if history:
            recent_context = "\n".join(
                f"- {msg.get('role', 'user')}: {msg.get('content', '')[:80]}"
                for msg in history[-3:]
            )

        return f"""현재 서버에 GEMINI_API_KEY 또는 GOOGLE_API_KEY가 설정되어 있지 않아 AI 자동 작성은 임시 안내 모드로 동작 중입니다.

문서 유형: {document_type or '법률 문서'}
요청 내용: {user_message[:300]}

로컬에서 실제 챗봇 답변을 받으려면 백엔드 실행 환경의 .env 파일에 GEMINI_API_KEY 또는 GOOGLE_API_KEY를 설정한 뒤 서버를 재시작하세요.

지금 바로 진행하려면 아래 정보를 알려주세요.
1. 문서에 들어갈 당사자 이름
2. 날짜·금액·주소처럼 빈칸에 넣을 핵심 정보
3. 원하는 문체(간단/정중/강경)

최근 대화 요약:
{recent_context or '- 이전 대화 없음'}"""

    async def draft_document_chat(
        self,
        document_type: str,
        user_message: str,
        history: list[dict] | None = None
    ) -> str:
        history = history or []

        if not self.client:
            return self._draft_document_chat_fallback(document_type, user_message, history)

        history_text = "\n".join(
            [f"{msg.get('role', 'user')}: {msg.get('content', '')}" for msg in history]
        )

        prompt = f"""
너는 대한민국 법률 문서 작성 및 수정 보조 AI다.
사용자가 선택한 문서 유형에 맞춰 자연스럽고 정확하게 응답해야 한다.

[문서 유형]
{document_type}

[이전 대화]
{history_text}

[사용자 요청]
{user_message}

[응답 지침]
1. 사용자의 요청에 맞는 문장으로 바로 답변한다.
2. 문서 작성에 필요한 정보가 부족하면 한 번에 1~2개 정도만 추가 질문한다.
3. 사용자가 수정 요청을 하면 수정된 내용을 반영해서 제안한다.
4. 너무 장황하게 설명하지 말고 실무적으로 도움이 되게 작성한다.
5. 법률 전문가를 사칭하지 말고, 일반적인 법률 문서 작성 보조 수준에서 답한다.
"""

        last_error = None

        for model_name in self.model_candidates:
            for attempt in range(3):
                try:
                    response = await self.client.aio.models.generate_content(
                        model=model_name,
                        contents=prompt,
                        config={
                            "temperature": 0.3,
                        }
                    )

                    if not response.text:
                        raise HTTPException(status_code=503, detail="AI 응답이 비어 있습니다.")

                    return response.text.strip()

                except Exception as e:
                    last_error = e
                    print(f"❌ draft_document_chat 오류 | 모델: {model_name} | 시도 {attempt + 1}/3 | {e}")

                    error_text = str(e).lower()
                    if "503" in error_text or "unavailable" in error_text or "high demand" in error_text:
                        if attempt < 2:
                            await asyncio.sleep(2 * (attempt + 1))
                            continue
                        break

                    raise HTTPException(status_code=503, detail=f"AI 문서 채팅 실패: {str(e)}")

        raise HTTPException(status_code=503, detail=f"AI 문서 채팅 실패: {str(last_error)}")

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


    async def simulate_it_outsourcing_risk(
        self,
        contract_text: str,
        project_type: str,
        contract_amount: str,
        paid_amount: str,
        milestone_structure: str,
        requirement_change_level: str,
        ip_transfer_timing: str,
        maintenance_scope: str,
        delay_penalty: str,
        termination_settlement: str,
        server_cost_owner: str,
        handles_personal_data: str,
        open_source_policy: str,
    ) -> dict:
        prompt = f"""
너는 IT 외주 개발 계약, 프리랜서 용역, 소프트웨어 유지보수 계약의 리스크를 사전 진단하는 컨설턴트다.
아래 입력값과 계약서 내용을 바탕으로 발주자/수급자 모두에게 발생할 수 있는 6개월·1년 리스크를 분석해.

[입력 데이터]
- 프로젝트 유형: {project_type}
- 계약 금액: {contract_amount}
- 이미 지급된 금액: {paid_amount}
- 마일스톤 구조: {milestone_structure}
- 요구사항 변경 위험도: {requirement_change_level}
- IP/소스코드 이전 시점: {ip_transfer_timing}
- 유지보수 범위: {maintenance_scope}
- 지체상금 수준: {delay_penalty}
- 해지 시 기성고 정산 조항: {termination_settlement}
- 서버/호스팅/외부 API 비용 부담: {server_cost_owner}
- 개인정보 처리 여부: {handles_personal_data}
- 오픈소스 정책: {open_source_policy}

[계약서 내용]
{contract_text}

[분석 카테고리]
1. 대금 지급 / 미수금
2. 검수 / 납품 기준
3. 추가 개발 / 요구사항 변경
4. 지식재산권 / 소스코드
5. 유지보수 / 하자보수
6. 지체상금 / 일정 지연
7. 계약 해지 / 기성고 정산
8. 서버 / 호스팅 / 외부 API 비용
9. 개인정보 / 보안 책임
10. 오픈소스 라이선스

각 카테고리는 Safe, Warning, Danger 중 하나로 판정해.

[출력 JSON 형식]
{{
  "score": 0,
  "summary": "전체 IT 외주 리스크 요약 2~3문장",
  "risk_cards": [
    {{
      "category": "대금 지급 / 미수금",
      "status": "Safe/Warning/Danger",
      "title": "진단 제목",
      "desc": "구체적 위험 설명",
      "clause_hint": "확인해야 할 조항",
      "fix": "수정 제안"
    }}
  ],
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