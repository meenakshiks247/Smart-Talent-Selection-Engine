from pydantic import BaseModel


class ResumeUploadResult(BaseModel):
    original_filename: str
    saved_filename: str
    file_type: str
    extraction_status: str
    preview_text: str


class BulkUploadResponse(BaseModel):
    total_files: int
    successful_extractions: int
    failed_extractions: int
    files: list[ResumeUploadResult]
    message: str
