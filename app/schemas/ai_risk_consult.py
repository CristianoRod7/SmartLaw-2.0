from typing import Any, Dict, List, Optional
from pydantic import BaseModel, Field


class AiRiskConsultRequest(BaseModel):
    message: str = Field(..., min_length=1, max_length=4000)
    context: Dict[str, Any] = Field(default_factory=dict)


class DetectedRisk(BaseModel):
    title: str
    level: str = "주의"
    reason: str


class RecommendedAction(BaseModel):
    label: str
    description: str
    route: str


class AiRiskConsultResponse(BaseModel):
    answer: str
    detectedRisks: List[DetectedRisk] = Field(default_factory=list)
    checkpoints: List[str] = Field(default_factory=list)
    recommendedActions: List[RecommendedAction] = Field(default_factory=list)
    followUpQuestions: List[str] = Field(default_factory=list)
    source: Optional[str] = "openai"
