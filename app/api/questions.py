from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List

from app.core.db import get_db
from app.models.models import Question
from app.schemas import QuestionCreate, QuestionRead

router = APIRouter(prefix="/api/questions", tags=["questions"])


@router.post("/", response_model=QuestionRead)
def create_question(question: QuestionCreate, db: Session = Depends(get_db)):
    db_obj = Question(**question.dict())
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj


@router.get("/", response_model=List[QuestionRead])
def list_questions(db: Session = Depends(get_db)):
    return db.query(Question).all()
