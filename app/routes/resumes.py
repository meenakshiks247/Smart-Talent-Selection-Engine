from fastapi import APIRouter, File, HTTPException, UploadFile, status

from app.models.schemas import BulkUploadResponse
from app.services.resume_service import handle_bulk_resume_upload


router = APIRouter()


@router.post(
    "/bulk-upload",
    response_model=BulkUploadResponse,
    status_code=status.HTTP_201_CREATED,
)
async def bulk_upload_resumes(files: list[UploadFile] = File(...)) -> BulkUploadResponse:
    if not files:
        raise HTTPException(status_code=400, detail="Please upload at least one resume file.")

    return await handle_bulk_resume_upload(files)
