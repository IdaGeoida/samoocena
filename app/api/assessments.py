from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List

from app.core.db import get_db
from app.models.models import Assessment
from app.schemas import AssessmentCreate, AssessmentRead

router = APIRouter(prefix="/api/assessments", tags=["assessments"])

@router.post("/", response_model=AssessmentRead)
def create_assessment(assessment: AssessmentCreate, db: Session = Depends(get_db)):
    db_obj = Assessment(**assessment.model_dump())
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj

@router.get("/", response_model=List[AssessmentRead])
def list_assessments(db: Session = Depends(get_db)):
    return db.query(Assessment).order_by(Assessment.id).all()
