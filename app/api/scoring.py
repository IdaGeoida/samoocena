from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List

from app.core.db import get_db
from app.models.models import Process
from app.schemas import ScoreInput

router = APIRouter(prefix="/api/scoring", tags=["scoring"])

@router.post("/")
def score_processes(scores: List[ScoreInput], db: Session = Depends(get_db)):
    results = []
    for s in scores:
        process = db.get(Process, s.process_id)
        if not process or s.score is None:
            continue
        results.append(s.score)
    overall = sum(results) / len(results) if results else 0
    return {"overall": overall, "by_process": results}
