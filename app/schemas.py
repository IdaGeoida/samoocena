from typing import Optional, List
from pydantic import BaseModel, ConfigDict
from datetime import datetime

class ProcessBase(BaseModel):
    name: str
    category_id: int

class ProcessCreate(ProcessBase):
    pass

class ProcessRead(ProcessBase):
    id: int
    model_config = ConfigDict(from_attributes=True)


class CategoryBase(BaseModel):
    id: int
    name: str


class CategoryCreate(CategoryBase):
    pass


class CategoryRead(CategoryBase):
    model_config = ConfigDict(from_attributes=True)


class SubcategoryBase(BaseModel):
    id: int
    name: str
    description: str | None = None
    category_id: int


class SubcategoryCreate(SubcategoryBase):
    pass


class SubcategoryRead(SubcategoryBase):
    model_config = ConfigDict(from_attributes=True)


class QuestionBase(BaseModel):
    id: int
    category_id: int
    subcategory_id: int
    description: str
    detail: str | None = None
    scale_min_text: str | None = None
    scale_max_text: str | None = None


class QuestionCreate(QuestionBase):
    pass


class QuestionRead(QuestionBase):
    model_config = ConfigDict(from_attributes=True)

class ScoreInput(BaseModel):
    process_id: int
    score: Optional[int] = None


class AssessmentBase(BaseModel):
    employees_range: str
    volunteers_range: str
    results: List[int]


class AssessmentCreate(AssessmentBase):
    pass


class AssessmentRead(AssessmentBase):
    id: int
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)
