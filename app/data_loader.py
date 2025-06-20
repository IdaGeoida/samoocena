import os
from pathlib import Path
from typing import Any, Dict, List

import yaml

from app.core.db import SessionLocal, engine
from app.models.models import Base, Category, Subcategory, Question


def _get_pk(model, item):
    if model is Subcategory:
        return (item['category_id'], item['id'])
    if model is Question:
        return (item['category_id'], item['subcategory_id'], item['id'])
    return item['id']


def _load_items(session, model, items: List[Dict[str, Any]]):
    for item in items:
        obj = session.get(model, _get_pk(model, item))
        if obj is None:
            session.add(model(**item))
        else:
            for key, value in item.items():
                setattr(obj, key, value)


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
