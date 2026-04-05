from pathlib import Path

from fastapi import UploadFile

from app.models.schemas import BulkUploadResponse, ResumeUploadResult
from app.services.candidate_profile_service import build_candidate_profile
from app.services.text_extraction_service import extract_text_from_file
from app.utils.file_handler import save_upload_file


UPLOAD_DIR = Path("uploads")


async def handle_bulk_resume_upload(files: list[UploadFile]) -> BulkUploadResponse:
    upload_results: list[ResumeUploadResult] = []
    successful_extractions = 0

    for file in files:
        original_filename = file.filename or "unknown"
        file_type = Path(original_filename).suffix.lower() or "unknown"

        saved_filename = ""
        preview_text = ""
        extraction_status = "failed"
        name = ""
        skills: list[str] = []
        experience_years: int | float = 0
        projects: list[str] = []

        try:
            saved_filename, _ = await save_upload_file(upload_dir=UPLOAD_DIR, upload_file=file)
            saved_file_path = UPLOAD_DIR / saved_filename

            extracted_text = extract_text_from_file(saved_file_path)
            preview_text = extracted_text[:200]

            if len(extracted_text) > 0:
                extraction_status = "success"
                successful_extractions += 1

            try:
                profile_data = build_candidate_profile(extracted_text)
                name = str(profile_data.get("name", ""))
                skills = list(profile_data.get("skills", []))
                experience_years = profile_data.get("experience_years", 0)
                projects = list(profile_data.get("projects", []))
            except Exception:
                # Keep default profile values if profile extraction fails.
                name = ""
                skills = []
                experience_years = 0
                projects = []
        except Exception:
            # Continue processing remaining files even if one file fails.
            extraction_status = "failed"

        upload_results.append(
            ResumeUploadResult(
                original_filename=original_filename,
                saved_filename=saved_filename,
                file_type=file_type,
                extraction_status=extraction_status,
                preview_text=preview_text,
                name=name,
                skills=skills,
                experience_years=experience_years,
                projects=projects,
            )
        )

    total_files = len(files)
    failed_extractions = total_files - successful_extractions

    return BulkUploadResponse(
        total_files=total_files,
        successful_extractions=successful_extractions,
        failed_extractions=failed_extractions,
        files=upload_results,
        message="Bulk upload processed. Extraction results are ready for table display.",
    )
