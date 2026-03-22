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
            model_name='gemini-1.5-flash',
            generation_config={
                "temperature": 0.2,
                "response_mime_type": "application/json",
            }
        )
        
        self.simulation_mode = False 

    # ==========================================
    # 1. 계약서 리스크 분석 로직 (단방향)
    # ==========================================
    async def analyze_contract_risk(self, contract_text: str) -> dict:
        if self.simulation_mode:
            await asyncio.sleep(random.uniform(1.0, 2.0)) 
            return self._get_mock_analysis_data()
        
        try:
            print("🧠 AI 변호사 분석 시작... (Gemini 1.5 Flash API 호출 중)")
            prompt = f"""
            너는 대한민국 최고의 10년 차 부동산 전문 AI 변호사 'NextLaw'야.
            사용자가 제공하는 전세/월세 계약서의 OCR 추출 텍스트를 분석하고, 임차인(세입자)에게 불리한 독소 조항이나 리스크를 찾아내어 반드시 아래의 JSON 규격으로만 응답해.

            [필수 분석 카테고리 9개 및 매칭 아이콘]
            1. 배상 책임 (icon_type: "Coins")
            2. 계약 해지 (icon_type: "RefreshCw")
            3. 법적 분쟁 (icon_type: "Gavel")
            4. 대금 지급 (icon_type: "Coins")
            5. 특약 사항 (icon_type: "AlertTriangle")
            6. 수선 유지 (icon_type: "ShieldAlert")
            7. 개인정보 (icon_type: "Lock")
            8. 불가항력 (icon_type: "CloudRain")
            9. 대항력 보호 (icon_type: "ShieldCheck")

            [리스크 판단 기준 (status)]
            - Safe: 임차인에게 유리하거나 표준적인 조항
            - Warning: 주의가 필요하거나 협의의 여지가 있는 조항
            - Danger: 임차인에게 일방적으로 불리한 독소 조항 (반드시 수정 권고)

            [출력 JSON 포맷]
            {{
              "score": 85,
              "summary": "이 계약서 전체에 대한 AI 변호사의 2~3줄 총평 및 핵심 경고",
              "sections": [
                {{
                  "category": "카테고리명",
                  "icon_type": "아이콘",
                  "items": [
                    {{
                      "page": "1p",
                      "line": "제4조",
                      "clause": "원상복구",
                      "status": "Danger",
                      "title": "관련 리스크 진단",
                      "desc": "어떤 부분이 문제인지, 어떤 피해가 갈 수 있는지 구체적으로 설명",
                      "law": "관련 법령",
                      "tip": "수정 요구 팁"
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
        # (기존 Mock 데이터 로직 동일)
        random_score = random.randint(30, 90)
        cats = [("배상 책임", "Coins"), ("계약 해지", "RefreshCw"), ("법적 분쟁", "Gavel"), ("대금 지급", "Coins"), ("특약 사항", "AlertTriangle"), ("수선 유지", "ShieldAlert"), ("개인정보", "Lock"), ("불가항력", "CloudRain"), ("대항력 보호", "ShieldCheck")]
        return {
            "score": random_score,
            "summary": "API 연동 지연으로 인한 임시 화면입니다.",
            "sections": [{"category": c[0], "icon_type": c[1], "items": [{"id": i, "page": f"{random.randint(1, 5)}p", "line": f"{random.randint(1, 30)}행", "clause": f"제{i+1}조", "status": "Warning", "title": f"API 연동 지연 ({c[0]})", "desc": "현재 네트워크 지연으로 시뮬레이션 데이터가 출력됩니다.", "law": "-", "tip": ".env를 확인하세요."}]} for i, c in enumerate(cats)]
        }

    # ==========================================
    # 2. 서류 작성 챗봇 로직 (초정밀 프롬프트 탑재 🚀)
    # ==========================================
    async def draft_document_chat(self, document_type: str, user_message: str, history: list) -> str:
        try:
            print(f"💬 [{document_type}] 작성을 위한 스마트 챗봇 가동 중...")

            # 🚀 [업그레이드] 나만큼 똑똑하게 대화하는 초정밀 프롬프트
            system_instruction = f"""
            당신은 청년들의 억울한 법률 문제를 해결해주는 10년 차 수석 AI 변호사 'NextLaw'입니다.
            현재 사용자는 법적 효력을 갖춘 [{document_type}] 작성을 위해 당신을 찾아왔습니다.
            당신은 사람과 대화하듯 아주 똑똑하고, 친절하며, 맥락을 완벽하게 이해해야 합니다.

            [🚨 절대 지켜야 할 핵심 원칙 🚨]
            1. **급발진 절대 금지**: 사용자가 인사("ㅎㅇ", "안녕")만 하거나 상황을 짧게 말했을 때, **절대 처음부터 완성된 서류 초안을 내놓지 마세요.**
            2. **티키타카 (Step-by-Step) 인터뷰**: 서류 작성에 필요한 핵심 정보(누가, 누구에게, 언제, 얼마를, 왜 등)를 한 번에 다 묻지 마세요. 한 번에 하나씩, 또는 연관된 두 개씩만 부드럽게 질문하세요. 취조하듯 묻지 말고 상담하듯 이끌어주세요.
            3. **공감과 안심 (가장 중요)**: 사용자가 돈을 못 받았거나 억울한 감정을 보이면, "많이 속상하셨겠습니다", "제가 이 서류를 통해 정당한 권리를 찾을 수 있도록 돕겠습니다. 안심하세요."라며 든든하게 공감해 주세요.
            4. **법률 용어 순화**: 청년들이 법을 모를 수 있으니 어려운 법률 용어는 괄호나 쉬운 말로 한 줄 풀어서 설명해주세요.

            [대화 진행 순서 (프로세스)]
            - **1단계 (인사 및 안심시키기)**: 사용자가 처음 말을 걸면, 따뜻하게 맞이하고 어떤 억울한 일이나 문제가 있는지 편하게 말해달라고 하세요.
            - **2단계 (사실관계 수집)**: [{document_type}] 작성에 필수적인 육하원칙 정보(나의 이름, 상대방 이름/연락처, 발생 날짜, 피해 금액, 계약서 유무 등)를 파악하기 위해 자연스럽게 질문을 던지세요.
            - **3단계 (정보 요약 및 확인)**: 정보가 다 모이면, "말씀해주신 내용을 요약하면 다음과 같습니다. ~ 이 내용으로 서류 초안을 작성할까요?"라고 확인을 받으세요.
            - **4단계 (최종 초안 작성)**: 사용자가 동의("네", "작성해줘" 등)하면, 그때 비로소 전문적인 법률 용어와 격식을 갖춘 완벽한 서류 텍스트를 마크다운 포맷으로 깔끔하게 작성해 제공하세요.

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

            # 챗봇 전용 모델 세팅 (JSON 제한 해제, 창의성 부여)
            chat_model = genai.GenerativeModel(
                model_name='gemini-1.5-flash',
                system_instruction=system_instruction,
                generation_config={"temperature": 0.6} # 대화가 너무 기계적이지 않고 자연스럽도록 0.6으로 설정
            )

            chat_session = chat_model.start_chat(history=gemini_history)
            response = await chat_session.send_message_async(user_message)
            
            return response.text

        except Exception as e:
            print(f"❌ 채팅 API 오류: {e}")
            return "죄송합니다. 현재 AI 변호사 네트워크에 일시적인 장애가 발생했습니다. 잠시 후 다시 말씀해 주시겠습니까?"

# 싱글톤 인스턴스
ai_service = AIService()