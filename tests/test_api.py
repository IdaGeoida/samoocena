import os
import sys
os.environ['DATABASE_URL'] = 'sqlite:///./test.db'
os.environ['SKIP_INIT_DATA'] = '1'
# ensure app package is importable
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from fastapi.testclient import TestClient
import pytest

from app.main import app
from app.core.db import engine
from app.models.models import Base

@pytest.fixture(autouse=True)
def setup_db():
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    yield

@pytest.fixture
def client():
    with TestClient(app) as c:
        yield c

def test_create_and_list_categories(client):
    resp = client.post('/api/categories/', json={'id': 1, 'name': 'Cat'})
    assert resp.status_code == 200
    data = resp.json()
    assert data['id'] == 1
    assert data['name'] == 'Cat'

    resp = client.get('/api/categories/')
    assert resp.status_code == 200
    assert len(resp.json()) == 1

def test_category_deduplication(client):
    client.post('/api/categories/', json={'id': 1, 'name': 'Cat'})
    client.post('/api/categories/', json={'id': 2, 'name': 'Cat'})
    resp = client.get('/api/categories/')
    assert resp.status_code == 200
    data = resp.json()
    assert len(data) == 2

def test_create_subcategory(client):
    client.post('/api/categories/', json={'id': 1, 'name': 'Cat'})
    resp = client.post('/api/subcategories/', json={'id': 1, 'name': 'Sub', 'description': 'Desc', 'category_id': 1})
    assert resp.status_code == 200
    resp = client.get('/api/subcategories/')
    assert resp.status_code == 200
    data = resp.json()
    assert len(data) == 1
    assert data[0]['id'] == 1


def test_create_question(client):
    client.post('/api/categories/', json={'id': 1, 'name': 'Cat'})
    client.post('/api/subcategories/', json={'id': 1, 'name': 'Sub', 'description': 'Desc', 'category_id': 1})
    resp = client.post('/api/questions/', json={
        'id': 1,
        'category_id': 1,
        'subcategory_id': 1,
        'description': 'Q1',
        'detail': 'd'
    })
    assert resp.status_code == 200
    resp = client.get('/api/questions/')
    assert resp.status_code == 200
    data = resp.json()
    assert len(data) == 1



def test_list_questions_by_category(client):
    client.post('/api/categories/', json={'id': 1, 'name': 'Cat1'})
    client.post('/api/categories/', json={'id': 2, 'name': 'Cat2'})
    client.post('/api/subcategories/', json={'id': 1, 'name': 'Sub1', 'description': 'd1', 'category_id': 1})
    client.post('/api/subcategories/', json={'id': 1, 'name': 'Sub2', 'description': 'd2', 'category_id': 2})
    client.post('/api/questions/', json={'id': 1, 'category_id': 1, 'subcategory_id': 1, 'description': 'Q1'})
    client.post('/api/questions/', json={'id': 2, 'category_id': 1, 'subcategory_id': 1, 'description': 'Q2'})
    client.post('/api/questions/', json={'id': 1, 'category_id': 2, 'subcategory_id': 1, 'description': 'Q3'})

    resp = client.get('/api/questions/', params={'category_id': '1'})
    assert resp.status_code == 200
    data = resp.json()
    assert len(data) == 2
    assert all(q['category_id'] == 1 for q in data)


def test_list_subcategories_by_category(client):
    client.post('/api/categories/', json={'id': 1, 'name': 'Cat1'})
    client.post('/api/categories/', json={'id': 2, 'name': 'Cat2'})
    client.post('/api/subcategories/', json={'id': 1, 'name': 'Sub1', 'description': 'd1', 'category_id': 1})
    client.post('/api/subcategories/', json={'id': 2, 'name': 'Sub2', 'description': 'd2', 'category_id': 2})

    resp = client.get('/api/subcategories/', params={'category_id': '1'})
    assert resp.status_code == 200
    data = resp.json()
    assert len(data) == 1
    assert data[0]['category_id'] == 1


def test_create_and_list_assessments(client):
    payload = {
        'employees_range': '1-10',
        'volunteers_range': '0-5',
        'results': [1, 2, 3]
    }
    resp = client.post('/api/assessments/', json=payload)
    assert resp.status_code == 200
    data = resp.json()
    assert data['id'] == 1
    assert data['employees_range'] == '1-10'
    resp = client.get('/api/assessments/')
    assert resp.status_code == 200
    data = resp.json()
    assert len(data) == 1
    assert data[0]['results'] == [1, 2, 3]
