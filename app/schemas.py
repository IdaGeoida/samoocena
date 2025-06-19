from typing import Optional
from pydantic import BaseModel

class ProcessBase(BaseModel):
    name: str
    category_id: int

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
    description: str | None = None
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
    detail: str | None = None


class QuestionCreate(QuestionBase):
    pass


class QuestionRead(QuestionBase):
    class Config:
        orm_mode = True

class ScoreInput(BaseModel):
    process_id: int
    score: Optional[int] = None
