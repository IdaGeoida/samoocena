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


class CategoryBase(BaseModel):
    id: int
    name: str


class CategoryCreate(CategoryBase):
    pass


class CategoryRead(CategoryBase):
    class Config:
        orm_mode = True


class SubcategoryBase(BaseModel):
    id: int
    name: str
    category_id: int


class SubcategoryCreate(SubcategoryBase):
    pass


class SubcategoryRead(SubcategoryBase):
    class Config:
        orm_mode = True


class QuestionBase(BaseModel):
    id: int
    category_id: int
    subcategory_id: int
    description: str


class QuestionCreate(QuestionBase):
    pass


class QuestionRead(QuestionBase):
    class Config:
        orm_mode = True

class ScoreInput(BaseModel):
    process_id: int
    level_general: int
    level_detailed: int
    level_extension: Optional[int] = None
