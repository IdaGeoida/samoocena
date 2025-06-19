from fastapi import FastAPI

from app.data_loader import load_initial_data

from app.api.processes import router as processes_router
from app.api.scoring import router as scoring_router
from app.api.categories import router as categories_router
from app.api.subcategories import router as subcategories_router
from app.api.questions import router as questions_router

app = FastAPI()


@app.on_event("startup")
def _load_data() -> None:
    load_initial_data()

app.include_router(processes_router)
app.include_router(scoring_router)
app.include_router(categories_router)
app.include_router(subcategories_router)
app.include_router(questions_router)
