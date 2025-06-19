from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List, Optional

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
def list_subcategories(
    category_id: Optional[str] = None, db: Session = Depends(get_db)
):
    query = db.query(Subcategory)
    if category_id:
        ids = [int(i) for i in category_id.split(",") if i]
        query = query.filter(Subcategory.category_id.in_(ids))
    return query.all()
