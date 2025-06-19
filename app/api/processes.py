from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List

from app.core.db import get_db
from app.models.models import Process
from app.schemas import ProcessCreate, ProcessRead

router = APIRouter(prefix="/api/processes", tags=["processes"])

@router.post("/", response_model=ProcessRead)
def create_process(process: ProcessCreate, db: Session = Depends(get_db)):
    db_obj = Process(**process.dict())
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj

@router.get("/", response_model=List[ProcessRead])
def list_processes(db: Session = Depends(get_db)):
    return db.query(Process).all()
