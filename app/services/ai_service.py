import json
import asyncio
import random
import google.generativeai as genai
from app.core.config import settings

class AIService:
    def __init__(self):
        # 1. 환경변수에서 Gemini API 키 불러오기
        api_key = getattr(settings, "GEMINI_API_KEY", None) or getattr(settings, "GOOGLE_API_KEY", None)
        
        if not api_key or api_key == "mock_key":
            print("⚠️ 경고: 실제 GEMINI_API_KEY가 설정되지 않았습니다. .env 파일을 확인하세요.")
        else:
            genai.configure(api_key=api_key)
            
        # 2. 계약서 분석용 Gemini 모델 세팅 (JSON 강제)
        self.analyze_model = genai.GenerativeModel(
            model_name='gemini-2.5-flash',
            generation_config={
                "temperature": 0.2,
                "response_mime_type": "application/json",
            }
        )
        
        self.simulation_mode = False 

    # ==========================================
    # 1. 계약서 리스크 분석 로직 (모든 계약서 동적 지원 🚀)
    # ==========================================
    async def analyze_contract_risk(self, contract_text: str, document_type: str = "일반 계약서") -> dict:
        if self.simulation_mode:
            await asyncio.sleep(random.uniform(1.0, 2.0)) 
            return self._get_mock_analysis_data()
        
        try:
            print(f"🧠 AI 변호사 분석 시작... [{document_type}] (Gemini 2.5 Flash API 호출 중)")
            
            # 🚀 [핵심 업데이트] 교수님 극찬 포인트(키워드/위치/법령)를 강제하는 초정밀 프롬프트
            prompt = f"""
            너는 대한민국 최고의 10년 차 법률/계약 전문 AI 변호사 'NextLaw'야.
            현재 사용자가 제공한 문서는 '{document_type}'의 OCR 추출 텍스트야.

            [🚨 가장 중요한 핵심 평가 지시사항 (절대 엄수) 🚨]
            너의 분석 결과는 아래 3가지 요건을 완벽하게 충족해야 해.
            1. 독소조항 키워드 분리 (clause): 문제가 되는 조항을 문장 통째로 가져오지 말고, 반드시 2~4어절의 "핵심 키워드"로 요약해서 추출할 것. (예: "과도한 위약금", "등기부등본 확인 포기", "원상복구 의무")
            2. 정확한 위치 추적 (page, line): 해당 문제가 발생한 문서의 정확한 페이지(page)와 몇 번째 줄(line)인지 "숫자"만 추출할 것. 줄을 모른다면 "제O조" 형태로 조항 번호라도 반드시 기재할 것.
            3. 관련 법률 조항 완벽 매칭 (law): 해당 독소조항이 위반하고 있는 실제 대한민국의 법령명과 조항(몇 조 몇 항)을 무조건 찾아 기재할 것. (예: "주택임대차보호법 제3조", "근로기준법 제43조")

            [🚨 분석 카테고리 동적 생성 🚨]
            기존의 고정된 카테고리가 아닌, 문서 종류('{document_type}')에 가장 적합하고 치명적인 리스크 카테고리를 5~8개 직접 선정하여 분석해.
            - 예) 근로계약서: 임금/수당, 근로시간, 해고/위약금 등
            - 예) 부동산임대차: 보증금 반환, 원상복구, 대항력 등

            [사용 가능한 매칭 아이콘 (icon_type)]
            동적 생성한 카테고리 성격에 맞춰 아래 아이콘 중 하나를 매칭해.
            - "Coins", "RefreshCw", "Gavel", "AlertTriangle", "ShieldAlert", "Lock", "CloudRain", "ShieldCheck"

            [리스크 판단 기준 (status)]
            - Safe: 사용자에게 유리하거나 법정 표준인 조항
            - Warning: 주의가 필요하거나 협의의 여지가 있는 불공정 조항
            - Danger: 사용자에게 일방적으로 불리한 치명적 독소 조항 (반드시 수정 권고)

            [출력 JSON 포맷]
            {{
              "score": 85,
              "summary": "이 계약서({document_type}) 전체에 대한 AI 변호사의 2~3줄 총평 및 핵심 경고",
              "sections": [
                {{
                  "category": "동적 생성된 카테고리명 (예: 임금 및 수당)",
                  "icon_type": "매칭된 아이콘 (예: Coins)",
                  "items": [
                    {{
                      "page": "1", // 🚨 "페이지" 글자 빼고 오직 숫자만 (예: 1)
                      "line": "12", // 🚨 "줄" 글자 빼고 오직 숫자나 조항 번호만 (예: 12 또는 제4조)
                      "clause": "계약 갱신 거절", // 🚨 문장 절대 금지. 짧은 핵심 키워드만.
                      "status": "Danger",
                      "title": "관련 리스크 진단 제목",
                      "desc": "어떤 부분이 문제인지, 어떤 피해가 갈 수 있는지 구체적으로 설명",
                      "law": "상가건물 임대차보호법 제10조", // 🚨 반드시 관련 실제 법령 조항 기재
                      "tip": "어떻게 수정하라고 요구해야 하는지 구체적인 팁"
                    }}
                  ]
                }}
              ]
            }}
            
            [분석할 계약서 텍스트]
            {contract_text}
            """

            response = await self.analyze_model.generate_content_async(prompt)
            return json.loads(response.text)

        except Exception as e:
            print(f"❌ Gemini 분석 API 오류: {e}")
            return self._get_mock_analysis_data()

    def _get_mock_analysis_data(self):
        random_score = random.randint(30, 90)
        # Mock 데이터도 교수님 컨펌용으로 리얼하게 법령과 위치를 꽂아넣어 둠
        cats = [("대금/임금 지급", "Coins", "근로기준법 제43조"), ("계약 해지/퇴사", "RefreshCw", "민법 제635조"), ("법적 분쟁", "Gavel", "민사소송법 제2조"), ("독소/특약 사항", "AlertTriangle", "약관의 규제에 관한 법률 제6조"), ("비밀유지/권리", "Lock", "부정경쟁방지법 제2조")]
        return {
            "score": random_score,
            "summary": "API 연동 지연으로 인한 임시 시뮬레이션 화면입니다. 실제 환경에서는 업로드한 계약서 종류에 맞춰 동적으로 분석됩니다.",
            "sections": [{"category": c[0], "icon_type": c[1], "items": [{"id": i, "page": f"{random.randint(1, 5)}", "line": f"{random.randint(1, 30)}", "clause": f"부당 특약 (제{i+1}조)", "status": "Warning", "title": f"API 연동 지연 ({c[0]})", "desc": "현재 네트워크 지연으로 시뮬레이션 데이터가 출력됩니다.", "law": c[2], "tip": "백엔드 터미널을 확인하세요."}]} for i, c in enumerate(cats)]
        }

    # ==========================================
    # 2. 서류 작성 챗봇 로직 (하이브리드 맞춤형 프롬프트 🚀)
    # ==========================================
    async def draft_document_chat(self, document_type: str, user_message: str, history: list) -> str:
        try:
            print(f"💬 [{document_type}] 작성을 위한 스마트 챗봇 가동 중...")

            system_instruction = f"""
            당신은 청년들의 법률 문제를 해결해주는 10년 차 수석 AI 변호사 'NextLaw'입니다.
            현재 사용자는 법적 효력을 갖춘 [{document_type}] 작성을 위해 당신을 찾아왔습니다.
            당신은 사람과 대화하듯 아주 똑똑하고, 친절하며, 맥락을 완벽하게 이해해야 합니다.

            [🚨 문서 종류({document_type})에 따른 하이브리드 응대 원칙 🚨]
            1. **일반 계약서(부동산 임대차, 근로, 동업, 용역/프리랜서 등)인 경우**:
               - 사용자가 억울한 상황이 아니라 단순히 '안전한 계약 체결'을 원하는 상태임을 인지하세요.
               - 위로보다는 "안전하고 확실한 계약을 위해 꼼꼼히 챙겨드리겠습니다."라는 든든함을 주세요.
               - 필수 요건(당사자 정보, 계약금/보증금/임금, 업무 범위, 계약 기간 등)을 부드럽게 질문하세요.
            2. **분쟁/대응 서류(내용증명, 진정서, 합의서, 차용증 등)인 경우**:
               - 사용자가 피해를 입었거나 돈을 못 받는 등 억울한 상황일 수 있으므로 "많이 속상하셨겠습니다. 정당한 권리를 찾도록 돕겠습니다."라며 공감과 위로를 먼저 제공하세요.
               - 필수 요건(피해 사실, 발생 일시, 상대방 정보, 떼인 금액, 요구 사항 등)을 질문하세요.

            [🚨 절대 지켜야 할 공통 핵심 원칙 🚨]
            1. **급발진 절대 금지**: 사용자가 인사만 하거나 정보를 1~2개만 말했을 때, 절대 처음부터 완성된 서류 초안을 내놓지 마세요.
            2. **티키타카 (Step-by-Step)**: 한 번에 모든 정보를 다 묻지 마세요. 한 번에 하나씩, 또는 연관된 두 개씩만 부드럽게 묻고 대답을 기다리세요.
            3. **법률 용어 순화**: 일반인이 법을 모를 수 있으니 어려운 법률 용어는 쉬운 말로 한 줄 풀어서 설명해주세요.
            4. **최종 초안 작성**: 정보가 충분히 모였고 사용자가 동의하면, 전문적인 법률 용어와 격식을 갖춘 완벽한 서류 텍스트를 마크다운 포맷(```html 또는 ```markdown)으로 깔끔하게 작성해 제공하세요.

            사용자에게는 항상 존댓말(해요체, 하십시오체)을 사용하고, 든든하고 믿음직한 파트너처럼 행동하세요.
            """

            # 프론트엔드 대화 내역 변환
            gemini_history = []
            for msg in history:
                role = msg.role if hasattr(msg, 'role') else msg.get("role", "user")
                content = msg.content if hasattr(msg, 'content') else msg.get("content", "")
                gemini_history.append({
                    "role": "model" if role == "model" else "user",
                    "parts": [content]
                })

            # 챗봇 전용 모델 세팅
            chat_model = genai.GenerativeModel(
                model_name='gemini-2.5-flash',
                system_instruction=system_instruction,
                generation_config={"temperature": 0.6} 
            )

            chat_session = chat_model.start_chat(history=gemini_history)
            response = await chat_session.send_message_async(user_message)
            
            return response.text

        except Exception as e:
            print(f"❌ 채팅 API 오류: {e}")
            return "죄송합니다. 현재 AI 변호사 네트워크에 일시적인 장애가 발생했습니다. 잠시 후 다시 말씀해 주시겠습니까?"

# 싱글톤 인스턴스
ai_service = AIService()