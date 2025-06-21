from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List, Optional

from app.core.db import get_db
from app.models.models import Process
from app.schemas import ProcessCreate, ProcessRead

router = APIRouter(prefix="/api/processes", tags=["processes"])

@router.post("/", response_model=ProcessRead)
def create_process(process: ProcessCreate, db: Session = Depends(get_db)):
    db_obj = Process(**process.model_dump())
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj

@router.get("/", response_model=List[ProcessRead])
def list_processes(category_id: Optional[str] = None, db: Session = Depends(get_db)):
    query = db.query(Process)
    if category_id:
        ids = [int(i) for i in category_id.split(',') if i]
        query = query.filter(Process.category_id.in_(ids))
    return query.all()
