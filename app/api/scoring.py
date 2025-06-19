from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List

from app.core.db import get_db
from app.models.models import Process, Applicability
from app.schemas import ScoreInput

router = APIRouter(prefix="/api/scoring", tags=["scoring"])

@router.post("/")
def score_processes(scores: List[ScoreInput], db: Session = Depends(get_db)):
    results = []
    for s in scores:
        process = db.query(Process).get(s.process_id)
        if not process or process.applicability == Applicability.NZ:
            continue
        values = [s.level_general, s.level_detailed]
        if s.level_extension is not None:
            values.append(s.level_extension)
        avg = sum(values) / len(values)
        results.append(avg)
    overall = sum(results) / len(results) if results else 0
    return {"overall": overall, "by_process": results}
