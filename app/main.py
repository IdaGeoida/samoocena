from fastapi import FastAPI
from contextlib import asynccontextmanager

from app.data_loader import load_initial_data

from app.api.processes import router as processes_router
from app.api.scoring import router as scoring_router
from app.api.categories import router as categories_router
from app.api.subcategories import router as subcategories_router
from app.api.questions import router as questions_router
from app.api.assessments import router as assessments_router

@asynccontextmanager
async def lifespan(app: FastAPI):
    load_initial_data()
    yield

app = FastAPI(lifespan=lifespan)

app.include_router(processes_router)
app.include_router(scoring_router)
app.include_router(categories_router)
app.include_router(subcategories_router)
app.include_router(questions_router)
app.include_router(assessments_router)
