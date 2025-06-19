import os
from pathlib import Path
from typing import Any, Dict, List

import yaml

from app.core.db import SessionLocal
from app.models.models import Category, Subcategory, Question


def _load_items(session, model, items: List[Dict[str, Any]]):
    for item in items:
        if session.get(model, item['id']) is None:
            session.add(model(**item))


def load_initial_data(path: str | Path | None = None) -> None:
    """Load categories, subcategories and questions from YAML file."""
    if os.getenv("SKIP_INIT_DATA"):
        return
    if path is None:
        path = Path(os.getenv("INITIAL_DATA_PATH", Path(__file__).with_name("initial_data.yml")))
    else:
        path = Path(path)
    if not path.exists():
        return
    data = yaml.safe_load(path.read_text()) or {}
    session = SessionLocal()
    try:
        _load_items(session, Category, data.get("categories", []))
        _load_items(session, Subcategory, data.get("subcategories", []))
        _load_items(session, Question, data.get("questions", []))
        session.commit()
    finally:
        session.close()
