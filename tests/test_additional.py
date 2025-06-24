import os
import sys
import yaml
import pytest

os.environ['DATABASE_URL'] = 'sqlite:///./test.db'
os.environ['SKIP_INIT_DATA'] = '1'
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app.data_loader import load_initial_data
from app.core.db import engine, SessionLocal
from app.models.models import Base, Category, Subcategory, Question
from fastapi.testclient import TestClient
from app.main import app

@pytest.fixture(autouse=True)
def setup_db():
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    yield

@pytest.fixture
def client():
    with TestClient(app) as c:
        yield c

def test_list_questions_multiple_categories(client):
    client.post('/api/categories/', json={'id': 1, 'name': 'Cat1'})
    client.post('/api/categories/', json={'id': 2, 'name': 'Cat2'})
    client.post('/api/subcategories/', json={'id': 1, 'name': 'Sub1', 'description': 'd1', 'category_id': 1})
    client.post('/api/subcategories/', json={'id': 1, 'name': 'Sub2', 'description': 'd2', 'category_id': 2})
    client.post('/api/questions/', json={'id': 1, 'category_id': 1, 'subcategory_id': 1, 'description': 'Q1', 'detail': 'd1'})
    client.post('/api/questions/', json={'id': 1, 'category_id': 2, 'subcategory_id': 1, 'description': 'Q2', 'detail': 'd2'})
    resp = client.get('/api/questions/', params={'category_id': '1,2'})
    assert resp.status_code == 200
    data = resp.json()
    assert len(data) == 2
    ids = {(q['category_id'], q['subcategory_id'], q['id']) for q in data}
    assert ids == {(1, 1, 1), (2, 1, 1)}

def test_load_initial_data(tmp_path):
    os.environ['SKIP_INIT_DATA'] = ''
    data = {
        'categories': [{'id': 1, 'name': 'Cat'}],
        'subcategories': [{'id': 1, 'name': 'Sub', 'description': 'd', 'category_id': 1}],
        'questions': [{'id': 1, 'category_id': 1, 'subcategory_id': 1, 'description': 'Q', 'detail': 'info'}]
    }
    path = tmp_path / 'data.yml'
    path.write_text(yaml.safe_dump(data))
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    load_initial_data(path)
    session = SessionLocal()
    try:
        assert session.query(Category).count() == 1
        assert session.query(Subcategory).count() == 1
        assert session.query(Question).count() == 1
    finally:
        session.close()
    os.environ['SKIP_INIT_DATA'] = '1'
