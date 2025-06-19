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

def test_create_subcategory(client):
    client.post('/api/categories/', json={'id': 1, 'name': 'Cat'})
    resp = client.post('/api/subcategories/', json={'id': 1, 'name': 'Sub', 'category_id': 1})
    assert resp.status_code == 200
    resp = client.get('/api/subcategories/')
    assert resp.status_code == 200
    data = resp.json()
    assert len(data) == 1
    assert data[0]['id'] == 1


def test_create_question(client):
    client.post('/api/categories/', json={'id': 1, 'name': 'Cat'})
    client.post('/api/subcategories/', json={'id': 1, 'name': 'Sub', 'category_id': 1})
    resp = client.post('/api/questions/', json={
        'id': 1,
        'category_id': 1,
        'subcategory_id': 1,
        'description': 'Q1'
    })
    assert resp.status_code == 200
    resp = client.get('/api/questions/')
    assert resp.status_code == 200
    data = resp.json()
    assert len(data) == 1


def test_score_processes(client):
    client.post('/api/categories/', json={'id': 1, 'name': 'Cat'})
    client.post('/api/processes/', json={'name': 'P1', 'category_id': 1})
    client.post('/api/processes/', json={'name': 'P2', 'category_id': 1})
    client.post('/api/processes/', json={'name': 'P3', 'category_id': 1})

    payload = [
        {'process_id': 1, 'score': 1},
        {'process_id': 2, 'score': None},
        {'process_id': 3, 'score': 5}
    ]
    resp = client.post('/api/scoring/', json=payload)
    assert resp.status_code == 200
    data = resp.json()
    assert data['by_process'] == [1, 5]
    assert data['overall'] == pytest.approx(3)
