from fastapi import APIRouter, HTTPException

from app.schemas.ai_risk_consult import AiRiskConsultRequest, AiRiskConsultResponse
from app.services.ai_risk_consult_service import ai_risk_consult_service

router = APIRouter()


@router.post("", response_model=AiRiskConsultResponse)
async def consult_ai_risk(request: AiRiskConsultRequest):
    try:
        return await ai_risk_consult_service.consult(
            message=request.message,
            context=request.context,
        )
    except HTTPException:
        raise
    except Exception as exc:
        print(f"❌ AI 리스크 상담 API 오류: {repr(exc)}")
        raise HTTPException(status_code=500, detail="AI 리스크 상담 처리 중 오류가 발생했습니다.") from exc
