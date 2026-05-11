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

        if isinstance(analysis_result, dict):
            analysis_result.setdefault("contract_text", contract_text)
            analysis_result.setdefault("document_type", document_type)
            analysis_result.setdefault("industry", industry)

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

@router.post("/simulate-it")
async def simulate_it_outsourcing(
    project_type: str = Form(...),
    contract_amount: str = Form(...),
    paid_amount: str = Form("0"),
    milestone_structure: str = Form("계약금/중도금/잔금"),
    requirement_change_level: str = Form("medium"),
    ip_transfer_timing: str = Form("after_final_payment"),
    maintenance_scope: str = Form("bugfix_only"),
    delay_penalty: str = Form("standard"),
    termination_settlement: str = Form("has_settlement"),
    server_cost_owner: str = Form("client"),
    handles_personal_data: str = Form("no"),
    open_source_policy: str = Form("allowed_with_notice"),
    file: UploadFile | None = File(None),
):
    try:
        print("🔥 IT 외주 시뮬레이터 시작")

        contract_text = "계약서 파일이 첨부되지 않았습니다."
        if file:
            contents = await file.read()
            contract_text = await document_service.process_file(contents, file.filename)

            if not contract_text.strip():
                raise HTTPException(status_code=400, detail="텍스트 없음")

        simulation_result = await ai_service.simulate_it_outsourcing_risk(
            contract_text=contract_text,
            project_type=project_type,
            contract_amount=contract_amount,
            paid_amount=paid_amount,
            milestone_structure=milestone_structure,
            requirement_change_level=requirement_change_level,
            ip_transfer_timing=ip_transfer_timing,
            maintenance_scope=maintenance_scope,
            delay_penalty=delay_penalty,
            termination_settlement=termination_settlement,
            server_cost_owner=server_cost_owner,
            handles_personal_data=handles_personal_data,
            open_source_policy=open_source_policy,
        )

        if isinstance(simulation_result, dict) and simulation_result.get("error"):
            raise HTTPException(status_code=503, detail=simulation_result["error"])

        return {
            "status": "success",
            "message": "IT 외주 시뮬레이션 완료",
            "data": simulation_result,
        }

    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except HTTPException:
        raise
    except Exception as e:
        print(f"❌ IT 외주 시뮬레이터 에러: {e}")
        raise HTTPException(status_code=500, detail=str(e))
