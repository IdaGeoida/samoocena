from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List

from app.core.db import get_db
from app.models.models import Subcategory
from app.schemas import SubcategoryCreate, SubcategoryRead

router = APIRouter(prefix="/api/subcategories", tags=["subcategories"])


@router.post("/", response_model=SubcategoryRead)
def create_subcategory(subcat: SubcategoryCreate, db: Session = Depends(get_db)):
    db_obj = Subcategory(**subcat.dict())
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj


@router.get("/", response_model=List[SubcategoryRead])
def list_subcategories(db: Session = Depends(get_db)):
    return db.query(Subcategory).all()
