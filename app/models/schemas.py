from pydantic import BaseModel


class ResumeUploadResult(BaseModel):
    original_filename: str
    saved_filename: str
    file_type: str
    extraction_status: str
    preview_text: str
    name: str
    skills: list[str]
    experience_years: int | float
    projects: list[str]


class BulkUploadResponse(BaseModel):
    total_files: int
    successful_extractions: int
    failed_extractions: int
    files: list[ResumeUploadResult]
    message: str
