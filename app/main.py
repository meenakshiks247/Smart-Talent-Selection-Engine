from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.router import api_router


app = FastAPI(
    title="HR Tech Resume Ingestion API",
    version="0.1.0",
    description="Backend API for bulk resume upload and future parsing workflows.",
)

# Beginner-friendly default CORS setup.
# Tighten this list to your frontend domains before production.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router)
