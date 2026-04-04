from fastapi import APIRouter

from app.routes.health import router as health_router
from app.routes.resumes import router as resumes_router


api_router = APIRouter()
api_router.include_router(health_router)
api_router.include_router(resumes_router, prefix="/api/v1/resumes", tags=["resumes"])
