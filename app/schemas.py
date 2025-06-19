from typing import Optional, List
from pydantic import BaseModel
from app.models.models import Applicability

class ProcessBase(BaseModel):
    name: str
    category_id: int
    applicability: Applicability

class ProcessCreate(ProcessBase):
    pass

class ProcessRead(ProcessBase):
    id: int
    class Config:
        orm_mode = True

class ScoreInput(BaseModel):
    process_id: int
    level_general: int
    level_detailed: int
    level_extension: Optional[int] = None
