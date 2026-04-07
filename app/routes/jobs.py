import json
from pathlib import Path
from uuid import uuid4

from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel

from app.models.schemas import CandidateProfileInput


router = APIRouter(tags=["jobs"])
STORE_PATH = Path("jobs_store.json")


class CreateJobRequest(BaseModel):
    role_title: str
    batch_date: str


def _load_store() -> dict:
    if not STORE_PATH.exists():
        return {"jobs": []}

    try:
        with STORE_PATH.open("r", encoding="utf-8") as file:
            data = json.load(file)
    except (json.JSONDecodeError, OSError):
        return {"jobs": []}

    if not isinstance(data, dict):
        return {"jobs": []}

    jobs = data.get("jobs", [])
    if not isinstance(jobs, list):
        return {"jobs": []}

    return {"jobs": jobs}


def _save_store(store: dict) -> None:
    with STORE_PATH.open("w", encoding="utf-8") as file:
        json.dump(store, file, indent=2)


def _find_job(store: dict, job_id: str) -> dict | None:
    for job in store.get("jobs", []):
        if isinstance(job, dict) and job.get("job_id") == job_id:
            return job
    return None


@router.post("/create", status_code=status.HTTP_201_CREATED)
async def create_job(payload: CreateJobRequest) -> dict:
    store = _load_store()

    new_job = {
        "job_id": str(uuid4()),
        "role_title": payload.role_title,
        "batch_date": payload.batch_date,
        "candidates": [],
    }

    store["jobs"].append(new_job)
    _save_store(store)

    return {
        "message": "Job created successfully.",
        "job": {
            "job_id": new_job["job_id"],
            "role_title": new_job["role_title"],
            "batch_date": new_job["batch_date"],
            "candidate_count": 0,
        },
    }


@router.post("/{job_id}/upload", status_code=status.HTTP_200_OK)
async def upload_candidates_for_job(job_id: str, candidates: list[CandidateProfileInput]) -> dict:
    store = _load_store()
    job = _find_job(store, job_id)

    if job is None:
        raise HTTPException(status_code=404, detail="Job not found.")

    existing_candidates = job.get("candidates", [])
    if not isinstance(existing_candidates, list):
        existing_candidates = []

    incoming_candidates = [candidate.model_dump() for candidate in candidates]
    job["candidates"] = existing_candidates + incoming_candidates

    _save_store(store)

    return {
        "message": "Candidates uploaded successfully.",
        "job_id": job_id,
        "uploaded_count": len(incoming_candidates),
        "total_candidates": len(job["candidates"]),
    }


@router.get("", status_code=status.HTTP_200_OK)
async def list_jobs() -> dict:
    store = _load_store()
    jobs_summary: list[dict] = []

    for job in store.get("jobs", []):
        if not isinstance(job, dict):
            continue

        candidates = job.get("candidates", [])
        candidate_count = len(candidates) if isinstance(candidates, list) else 0

        jobs_summary.append(
            {
                "job_id": job.get("job_id", ""),
                "role_title": job.get("role_title", ""),
                "batch_date": job.get("batch_date", ""),
                "candidate_count": candidate_count,
            }
        )

    return {"jobs": jobs_summary}


@router.get("/{job_id}/candidates", status_code=status.HTTP_200_OK)
async def get_job_candidates(job_id: str) -> dict:
    store = _load_store()
    job = _find_job(store, job_id)

    if job is None:
        raise HTTPException(status_code=404, detail="Job not found.")

    candidates = job.get("candidates", [])
    if not isinstance(candidates, list):
        candidates = []

    return {
        "job_id": job_id,
        "role_title": job.get("role_title", ""),
        "batch_date": job.get("batch_date", ""),
        "total_candidates": len(candidates),
        "candidates": candidates,
    }