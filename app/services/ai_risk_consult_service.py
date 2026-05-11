import asyncio
import json
from typing import Any, Dict

import requests

from app.core.config import settings
from app.schemas.ai_risk_consult import AiRiskConsultResponse

SYSTEM_PROMPT = """너는 스마트팜, 농지 임대차, 보조금 환수, 시설 시공 계약, IT 외주 계약 리스크를 안내하는 Legal-tech AI 상담 도우미다.
법률 자문을 확정적으로 제공하지 말고, 계약 검토 방향과 확인해야 할 조항을 안내한다.
사용자 입력을 바탕으로 리스크 유형, 확인 포인트, 추천 기능, 후속 질문을 JSON으로 반환한다.
과장된 단정, 변호사 자문 대체 표현, 확정적 법률 판단은 피한다.
답변은 한국어로 작성한다."""

RESPONSE_SCHEMA: Dict[str, Any] = {
    "type": "object",
    "additionalProperties": False,
    "properties": {
        "answer": {"type": "string"},
        "detectedRisks": {
            "type": "array",
            "items": {
                "type": "object",
                "additionalProperties": False,
                "properties": {
                    "title": {"type": "string"},
                    "level": {"type": "string", "enum": ["낮음", "주의", "위험"]},
                    "reason": {"type": "string"},
                },
                "required": ["title", "level", "reason"],
            },
        },
        "checkpoints": {"type": "array", "items": {"type": "string"}},
        "recommendedActions": {
            "type": "array",
            "items": {
                "type": "object",
                "additionalProperties": False,
                "properties": {
                    "label": {"type": "string"},
                    "description": {"type": "string"},
                    "route": {"type": "string"},
                },
                "required": ["label", "description", "route"],
            },
        },
        "followUpQuestions": {"type": "array", "items": {"type": "string"}},
    },
    "required": ["answer", "detectedRisks", "checkpoints", "recommendedActions", "followUpQuestions"],
}


def _fallback_response(message: str, fallback_reason: str) -> AiRiskConsultResponse:
    normalized = message.replace(" ", "").lower()

    if any(keyword in normalized for keyword in ["하자보수", "시공", "유지보수"]):
        return AiRiskConsultResponse(
            answer="입력하신 내용은 시공사 유지보수 책임과 관련된 분쟁 가능성이 있습니다. 하자보수 기간, 무상 수리 범위, 비용 부담 주체가 계약서에 구체적으로 적혀 있는지 먼저 확인해 보세요.",
            detectedRisks=[
                {"title": "하자보수 책임 불명확", "level": "주의", "reason": "무상 수리 범위와 기간이 명확하지 않으면 비용 부담 분쟁이 발생할 수 있습니다."},
                {"title": "유지보수 비용 전가 가능성", "level": "주의", "reason": "유지보수 책임 주체가 모호하면 발주자에게 비용이 전가될 수 있습니다."},
            ],
            checkpoints=["하자보수 기간이 명시되어 있는지 확인", "무상 수리 범위가 구체적인지 확인", "유지보수 비용 부담 주체가 명확한지 확인"],
            recommendedActions=[
                {"label": "스마트팜 계약 스캔", "description": "계약서의 하자보수 및 책임 조항을 분석합니다.", "route": "/smartfarm"},
                {"label": "정책·이슈 확인", "description": "관련 정책과 지원사업 이슈를 확인합니다.", "route": "/policy"},
            ],
            followUpQuestions=["계약서에 하자보수 기간이 몇 개월로 적혀 있나요?", "무상 수리와 유상 수리 기준이 구분되어 있나요?"],
            source="fallback",
            fallbackReason=fallback_reason,
        )

    if any(keyword in normalized for keyword in ["보조금", "환수", "지원금"]):
        return AiRiskConsultResponse(
            answer="보조금이나 지원금이 연결된 계약은 환수 조건, 목적 외 사용 제한, 사후관리 의무를 함께 검토해야 합니다.",
            detectedRisks=[{"title": "보조금 환수 조건 검토 필요", "level": "주의", "reason": "사업 목적이나 설치 기준을 벗어나면 환수 위험이 생길 수 있습니다."}],
            checkpoints=["보조금 교부 조건 확인", "목적 외 사용 금지 조항 확인", "계약 해지 시 반환 책임 확인"],
            recommendedActions=[
                {"label": "스마트팜 허브", "description": "스마트팜 계약 유형별 리스크를 확인합니다.", "route": "/smartfarm"},
                {"label": "정책·이슈 확인", "description": "지원사업 공고와 정책 변경사항을 확인합니다.", "route": "/policy"},
            ],
            followUpQuestions=["지원금 교부 조건 문서가 계약서에 첨부되어 있나요?", "계약 해지 시 보조금 반환 책임은 누구에게 있나요?"],
            source="fallback",
            fallbackReason=fallback_reason,
        )

    if any(keyword in normalized for keyword in ["농지", "임대차", "농업목적"]):
        return AiRiskConsultResponse(
            answer="농지 임대차나 농업 목적 사용이 포함된 경우 목적 외 사용, 시설 설치 권한, 원상회복 범위를 우선 확인해야 합니다.",
            detectedRisks=[{"title": "농지 목적 외 사용 위험", "level": "주의", "reason": "임대 목적과 실제 시설 운영 목적이 다르면 분쟁 또는 규제 리스크가 발생할 수 있습니다."}],
            checkpoints=["농지 사용 목적 확인", "시설 설치 가능 범위 확인", "원상회복 책임 확인"],
            recommendedActions=[
                {"label": "스마트팜 허브", "description": "농지·스마트팜 계약 리스크를 확인합니다.", "route": "/smartfarm"},
                {"label": "법률 라이브러리", "description": "관련 계약 문서와 양식을 확인합니다.", "route": "/legal"},
            ],
            followUpQuestions=["임대차 계약서에 스마트팜 시설 설치가 허용되어 있나요?", "계약 종료 시 원상회복 범위가 적혀 있나요?"],
            source="fallback",
            fallbackReason=fallback_reason,
        )

    return AiRiskConsultResponse(
        answer="입력하신 계약 상황은 책임 범위, 비용 부담, 해지 조건을 중심으로 검토하는 것이 좋습니다. 계약 유형과 문제가 되는 조항을 조금 더 구체적으로 알려주시면 검토 방향을 더 좁혀드릴 수 있습니다.",
        detectedRisks=[{"title": "계약 책임 범위 불명확", "level": "주의", "reason": "당사자별 의무와 비용 부담이 모호하면 분쟁 가능성이 있습니다."}],
        checkpoints=["당사자별 의무 확인", "비용 부담 주체 확인", "계약 해지 조건 확인"],
        recommendedActions=[
            {"label": "계약 분석 시작", "description": "계약서 전체를 업로드해 독소조항을 확인합니다.", "route": "/analysis"},
            {"label": "스마트팜 허브", "description": "스마트팜 관련 계약 유형을 확인합니다.", "route": "/smartfarm"},
        ],
        followUpQuestions=["문제가 된 조항 문구를 그대로 입력해 주실 수 있나요?", "계약 유형이 시공, 임대차, 외주 중 어디에 가까운가요?"],
        source="fallback",
        fallbackReason=fallback_reason,
    )


class AiRiskConsultService:
    def __init__(self):
        self.api_key = getattr(settings, "OPENAI_API_KEY", "")
        self.model = getattr(settings, "OPENAI_MODEL", "gpt-4.1-mini") or "gpt-4.1-mini"
        self.timeout = 20

    def _extract_output_text(self, payload: Dict[str, Any]) -> str:
        if payload.get("output_text"):
            return payload["output_text"]

        for output in payload.get("output", []):
            if output.get("type") == "message":
                for content in output.get("content", []):
                    if content.get("type") == "output_text" and content.get("text"):
                        return content["text"]

        return ""

    def _request_openai(self, message: str, context: Dict[str, Any]) -> Dict[str, Any]:
        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json",
        }
        body = {
            "model": self.model,
            "input": [
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": json.dumps({"message": message, "context": context}, ensure_ascii=False)},
            ],
            "temperature": 0.2,
            "text": {
                "format": {
                    "type": "json_schema",
                    "name": "ai_risk_consult_response",
                    "strict": True,
                    "schema": RESPONSE_SCHEMA,
                }
            },
        }
        response = requests.post(
            "https://api.openai.com/v1/responses",
            headers=headers,
            json=body,
            timeout=self.timeout,
        )
        response.raise_for_status()
        return response.json()

    async def consult(self, message: str, context: Dict[str, Any] | None = None) -> AiRiskConsultResponse:
        context = context or {}
        cleaned_message = message.strip()

        if len(cleaned_message) < 8:
            return AiRiskConsultResponse(
                answer="조금 더 구체적으로 입력해 주세요. 예를 들어 문제가 되는 계약 상황, 조항 문구, 비용 부담 또는 책임 범위를 함께 적어주시면 검토 방향을 안내할 수 있습니다.",
                detectedRisks=[],
                checkpoints=["문제가 되는 조항 또는 상황을 1~2문장으로 입력", "계약 유형과 상대방 역할을 함께 입력"],
                recommendedActions=[{"label": "계약 분석 시작", "description": "계약서를 업로드해 리스크를 확인합니다.", "route": "/analysis"}],
                followUpQuestions=["어떤 계약서에서 문제가 발생했나요?", "상대방이 부담해야 하는 책임은 무엇인가요?"],
                source="fallback",
                fallbackReason="Input is too short",
            )

        if not self.api_key:
            return _fallback_response(cleaned_message, fallback_reason="OPENAI_API_KEY is missing")

        try:
            payload = await asyncio.to_thread(self._request_openai, cleaned_message, context)
            output_text = self._extract_output_text(payload)
            parsed = json.loads(output_text)
            return AiRiskConsultResponse(**parsed, source="openai")
        except Exception as exc:
            print(f"❌ OpenAI AI 리스크 상담 실패: {repr(exc)}")
            return _fallback_response(cleaned_message, fallback_reason=f"OpenAI request failed or response parsing failed: {type(exc).__name__}")


ai_risk_consult_service = AiRiskConsultService()
