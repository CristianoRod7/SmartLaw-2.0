from pydantic import BaseModel
from typing import List

class RiskFactor(BaseModel):
    clause: str
    danger_level: str
    description: str
    # 💡 형광펜 칠할 핵심 단어들을 리스트로 받음
    highlight_keywords: List[str] 

class AnalysisResponse(BaseModel):
    score: int
    summary: str
    risk_factors: List[RiskFactor]
    special_clauses: List[str]
    # 💡 사용자가 반드시 확인해야 할 '체크리스트' 추가
    urgent_actions: List[str] 
    final_verdict: str