from pydantic import BaseModel
from typing import List

class AnalysisItem(BaseModel):
    id: int
    page: str
    line: str
    clause: str
    status: str
    title: str
    desc: str
    law: str
    tip: str

class AnalysisSection(BaseModel):
    category: str
    icon_type: str
    items: List[AnalysisItem]

class AnalysisResponse(BaseModel):
    score: int
    summary: str
    sections: List[AnalysisSection]