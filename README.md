# HR Tech Resume Ingestion API

Beginner-friendly FastAPI backend for bulk resume upload with a clean architecture.

## Features

- Health check endpoint
- Bulk resume upload endpoint
- CORS enabled
- File type validation (`.pdf`, `.doc`, `.docx`, `.txt`, `.jpg`, `.jpeg`, `.png`)
- File storage with unique names
- Reusable text extraction service for PDF, DOCX, and image files
- Structured folders for routes, services, utils, and models
- Parsing-ready service layer for future enhancements

## Project Structure

```text
app/
  api/
    router.py
  main.py
  models/
    schemas.py
  routes/
    health.py
    resumes.py
  services/
    resume_service.py
    text_extraction_service.py
  utils/
    file_handler.py
uploads/
requirements.txt
README.md
```

## Setup

1. Create and activate a virtual environment (Python 3.11).
2. Install dependencies:

```bash
pip install -r requirements.txt
```

3. Run the app:

```bash
uvicorn app.main:app --reload
```

4. Open docs:

- Swagger UI: `http://127.0.0.1:8000/docs`
- ReDoc: `http://127.0.0.1:8000/redoc`

## OCR Prerequisite

`pytesseract` requires the Tesseract OCR engine to be installed on your machine.

- Windows: install Tesseract and add its install folder to your PATH.
- If Tesseract is not installed, image extraction will safely return an empty string.

## Endpoints

- `GET /health`
  - Returns basic service status.
- `POST /api/v1/resumes/bulk-upload`
  - Form field: `files` (multiple files supported)
  - Saves uploaded resumes into `uploads/`

## Next Step (Parsing)

You can later extend `app/services/resume_service.py` to call a parser service (for example OCR, NLP, or LLM extraction) after each file is stored.
