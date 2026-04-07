import asyncio

import httpx

from app.main import app
from app.models.schemas import BulkUploadResponse, ResumeUploadResult
import app.routes.resumes as resumes_module


async def _mock_handle_bulk_resume_upload(files):  # noqa: ANN001
    return BulkUploadResponse(
        total_files=1,
        successful_extractions=1,
        failed_extractions=0,
        files=[
            ResumeUploadResult(
                original_filename="resume.pdf",
                saved_filename="saved_resume.pdf",
                file_type=".pdf",
                extraction_status="success",
                preview_text="Sample preview text",
                name="John Smith",
                skills=["Python", "Docker"],
                experience_years=3,
                projects=["Resume Parser API"],
            )
        ],
        message="Bulk upload processed. Extraction results are ready for table display.",
    )


def test_bulk_upload_response_includes_profile_fields(monkeypatch) -> None:
    monkeypatch.setattr(resumes_module, "handle_bulk_resume_upload", _mock_handle_bulk_resume_upload)

    async def run_request() -> httpx.Response:
        transport = httpx.ASGITransport(app=app)
        async with httpx.AsyncClient(transport=transport, base_url="http://test") as client:
            return await client.post(
                "/api/v1/resumes/bulk-upload",
                files={"files": ("resume.pdf", b"fake pdf content", "application/pdf")},
            )

    response = asyncio.run(run_request())

    assert response.status_code == 201

    payload = response.json()
    assert payload["total_files"] == 1
    assert payload["successful_extractions"] == 1
    assert payload["failed_extractions"] == 0
    assert len(payload["files"]) == 1

    file_entry = payload["files"][0]
    assert file_entry["original_filename"] == "resume.pdf"
    assert file_entry["saved_filename"] == "saved_resume.pdf"
    assert file_entry["file_type"] == ".pdf"
    assert file_entry["extraction_status"] == "success"
    assert file_entry["preview_text"] == "Sample preview text"
    assert file_entry["name"] == "John Smith"
    assert file_entry["skills"] == ["Python", "Docker"]
    assert file_entry["experience_years"] == 3
    assert file_entry["projects"] == ["Resume Parser API"]