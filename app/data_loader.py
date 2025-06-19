import os
from pathlib import Path
from typing import Any, Dict, List

import yaml

from sqlalchemy import inspect

from app.core.db import SessionLocal, engine
from app.models.models import Base, Category, Subcategory, Question


def _load_items(session, model, items: List[Dict[str, Any]]):
    inspector = inspect(model)
    pk_cols = [c.name for c in inspector.primary_key]
    for item in items:
        key = tuple(item[col] for col in pk_cols)
        if len(pk_cols) == 1:
            key = key[0]
        if session.get(model, key) is None:
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
    Base.metadata.create_all(bind=engine)
    session = SessionLocal()
    try:
        _load_items(session, Category, data.get("categories", []))
        session.commit()
        _load_items(session, Subcategory, data.get("subcategories", []))
        session.commit()
        _load_items(session, Question, data.get("questions", []))
        session.commit()
    finally:
        session.close()
