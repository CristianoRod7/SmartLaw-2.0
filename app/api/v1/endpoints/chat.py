from fastapi import APIRouter, HTTPException
from app.schemas.chat import ChatRequest
from app.services.ai_service import ai_service

router = APIRouter()

@router.post("/draft")
async def chat_for_drafting(request: ChatRequest):
    try:
        # Pydantic 모델을 딕셔너리로 변환해서 ai_service로 넘김
        history_list = [{"role": msg.role, "content": msg.content} for msg in request.history]
        
        # 🚀 10년 차 수석 AI 변호사 뇌 가동!
        ai_response = await ai_service.draft_document_chat(
            document_type=request.document_type,
            user_message=request.message,
            history=history_list
        )
        
        # 리액트가 찰떡같이 알아먹는 형태로 포장해서 반환
        return {
            "status": "success",
            "data": {
                "role": "model",
                "content": ai_response
            }
        }
    except Exception as e:
        print(f"❌ 채팅 API 오류: {e}")
        raise HTTPException(status_code=500, detail="채팅 서버 에러 발생")