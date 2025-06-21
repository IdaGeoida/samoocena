from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List, Optional

from app.core.db import get_db
from app.models.models import Question
from app.schemas import QuestionCreate, QuestionRead

router = APIRouter(prefix="/api/questions", tags=["questions"])


@router.post("/", response_model=QuestionRead)
def create_question(question: QuestionCreate, db: Session = Depends(get_db)):
    db_obj = Question(**question.model_dump())
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj


@router.get("/", response_model=List[QuestionRead])
def list_questions(category_id: Optional[str] = None, db: Session = Depends(get_db)):
    query = db.query(Question)
    if category_id:
        ids = [int(i) for i in category_id.split(',') if i]
        query = query.filter(Question.category_id.in_(ids))
    return query.all()
