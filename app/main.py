from fastapi import FastAPI

from app.api.processes import router as processes_router
from app.api.scoring import router as scoring_router

app = FastAPI()
app.include_router(processes_router)
app.include_router(scoring_router)
