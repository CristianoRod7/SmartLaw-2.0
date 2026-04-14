from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from app.services.ai_service import ai_service
from app.services.document_service import document_service

router = APIRouter()


@router.post("/contract")
async def analyze_contract(
    file: UploadFile = File(...),
    industry: str = Form("smartfarm"),
    document_type: str = Form("스마트팜 구축 계약")
):
    try:
        if not industry or industry == "undefined":
            industry = "smartfarm"

        if not document_type or document_type == "undefined":
            document_type = "스마트팜 구축 계약"

        print(f"🔥 분석 시작: [{industry}] [{document_type}] - {file.filename}")

        contents = await file.read()
        contract_text = await document_service.process_file(contents, file.filename)

        if not contract_text.strip():
            raise HTTPException(status_code=400, detail="텍스트 없음")

        if len(contract_text) < 50:
            raise HTTPException(status_code=400, detail="텍스트 너무 짧음")

        print("🤖 계약서 분석 요청...")
        analysis_result = await ai_service.analyze_contract_risk(
            contract_text=contract_text,
            document_type=document_type,
            industry=industry
        )

        if isinstance(analysis_result, dict) and analysis_result.get("error"):
            raise HTTPException(status_code=503, detail=analysis_result["error"])

        return {
            "status": "success",
            "data": analysis_result
        }

    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except HTTPException:
        raise
    except Exception as e:
        print(f"❌ 분석 에러: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/simulate")
async def simulate_smartfarm(
    file: UploadFile = File(...),
    contract_type: str = Form(...),
    land_type: str = Form(...),
    subsidy: str = Form(...),
    investment: str = Form(...),
    outsourcing: str = Form(...),
    operator: str = Form(...)
):
    try:
        print("🔥 시뮬레이터 시작")

        contents = await file.read()
        contract_text = await document_service.process_file(contents, file.filename)

        if not contract_text.strip():
            raise HTTPException(status_code=400, detail="텍스트 없음")

        print("🤖 시뮬레이션 요청...")

        simulation_result = await ai_service.simulate_smartfarm_risk(
            contract_text=contract_text,
            contract_type=contract_type,
            land_type=land_type,
            subsidy=subsidy,
            investment=investment,
            outsourcing=outsourcing,
            operator=operator
        )

        if isinstance(simulation_result, dict) and simulation_result.get("error"):
            raise HTTPException(status_code=503, detail=simulation_result["error"])

        print("✅ 시뮬레이션 완료")

        return {
            "status": "success",
            "message": "시뮬레이션 완료",
            "data": simulation_result
        }

    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except HTTPException:
        raise
    except Exception as e:
        print(f"❌ 시뮬레이터 에러: {e}")
        raise HTTPException(status_code=500, detail=str(e))