from typing import List
from pydantic import BaseModel, Field


class ChatMessage(BaseModel):
    role: str
    content: str


class ChatRequest(BaseModel):
    document_type: str
    message: str
    history: List[ChatMessage] = Field(default_factory=list)