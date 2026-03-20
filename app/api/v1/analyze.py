from fastapi import APIRouter, UploadFile, File, HTTPException, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.services.document_service import document_service
from app.services.ai_service import ai_service
from app.db.session import get_db             # 💡 DB 세션 가져오는 함수
from app.models.analysis import AnalysisRecord # 💡 분석 기록 모델
from sqlalchemy import select

router = APIRouter()
@router.get("/history", response_model=list)
async def get_analysis_history(
    db: AsyncSession = Depends(get_db),
    limit: int = 10,
    offset: int = 0
):
    """
    최근 분석한 기록들을 리스트로 가져옵니다. (페이징 지원)
    """
    # 최신순으로 정렬해서 가져오기
    query = select(AnalysisRecord).order_by(AnalysisRecord.created_at.desc()).limit(limit).offset(offset)
    result = await db.execute(query)
    records = result.scalars().all()
    
    return [
        {
            "id": r.id,
            "filename": r.filename,
            "created_at": r.created_at,
            "summary": r.analysis_result.get("summary", ""), # 요약본만 살짝 보여주기
            "score": r.analysis_result.get("score", 0)
        } for r in records
    ]
    
@router.get("/history/{record_id}")
async def get_analysis_detail(
    record_id: int,
    db: AsyncSession = Depends(get_db)
):
    """
    특정 분석 기록의 전체 상세 내용을 가져옵니다.
    """
    query = select(AnalysisRecord).where(AnalysisRecord.id == record_id)
    result = await db.execute(query)
    record = result.scalar_one_or_none()
    
    if not record:
        raise HTTPException(status_code=404, detail="기록을 찾을 수 없습니다. 🕵️")
        
    return {
        "id": record.id,
        "filename": record.filename,
        "created_at": record.created_at,
        "analysis_result": record.analysis_result # AI가 뱉었던 전체 JSON 데이터
    }
@router.post("/contract")
async def analyze_contract(
    file: UploadFile = File(...),
    db: AsyncSession = Depends(get_db) # 🚀 [핵심] 여기서 DB 세션을 주입받음!
):
    """
    계약서 업로드 -> OCR 추출 -> AI 분석 -> DB 저장까지 한큐에!
    """
    
    # 1. 파일 형식 체크
    allowed_types = ["image/jpeg", "image/png", "application/pdf"]
    if file.content_type not in allowed_types:
        raise HTTPException(status_code=400, detail="JPG, PNG, PDF 파일만 가능합니다. 📄")

    try:
        # 2. 파일 읽기 및 OCR 실행
        content = await file.read()
        extracted_text = await document_service.process_file(content, file.filename)
        
        if not extracted_text or len(extracted_text.strip()) < 10:
            raise HTTPException(status_code=422, detail="텍스트를 읽을 수 없습니다. 화질을 확인해주세요.")

        # 3. AI 분석 (우리가 만든 '신급 프롬프트' 작동!)
        analysis_result = await ai_service.analyze_contract_risk(extracted_text)

        # 4. DB에 결과 저장 💾
        new_record = AnalysisRecord(
            filename=file.filename,
            analysis_result=analysis_result # JSON 딕셔너리 그대로 저장
        )
        
        db.add(new_record)      # 장부 추가
        await db.commit()       # 저장 확정
        await db.refresh(new_record) # 생성된 ID값 가져오기

        # 5. 최종 결과 반환
        return {
            "id": new_record.id, # 👈 이제 DB에 저장된 번호가 나옴!
            "filename": file.filename,
            "status": "success",
            "data": analysis_result,
            "metadata": {
                "text_length": len(extracted_text),
                "preview": extracted_text[:50] + "..."
            }
        }
        
    except Exception as e:
        await db.rollback() # 에러 나면 DB 작업 취소 (리눅스 마스터급 꼼꼼함!)
        raise HTTPException(status_code=500, detail=f"서버 에러: {str(e)}")
    finally:
        await file.close()