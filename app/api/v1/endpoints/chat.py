from fastapi import APIRouter, HTTPException
from app.schemas.chat import ChatRequest
from app.services.ai_service import ai_service

router = APIRouter()


@router.post("/draft")
async def chat_for_drafting(request: ChatRequest):
    try:
        history_list = [{"role": msg.role, "content": msg.content} for msg in request.history]

        ai_response = await ai_service.draft_document_chat(
            document_type=request.document_type,
            user_message=request.message,
            history=history_list
        )

        return {
            "status": "success",
            "data": {
                "role": "model",
                "content": ai_response
            }
        }

    except HTTPException as e:
        print(f"❌ 채팅 API HTTP 오류: {e.detail}")
        raise e
    except Exception as e:
        print(f"❌ 채팅 API 오류: {repr(e)}")
        raise HTTPException(status_code=500, detail=str(e))