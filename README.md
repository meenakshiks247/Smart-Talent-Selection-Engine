# Smart Talent Selection Engine

Smart Talent Selection Engine is an AI-assisted hiring platform that helps recruiters process resumes, extract candidate details, and rank candidates against a job description.

It combines a FastAPI backend with a React frontend to support the full workflow from document upload to ranked candidate insights.

## Project Explanation

The project solves a common recruiting problem: manually reviewing large batches of resumes is slow, inconsistent, and difficult to scale.

This engine automates the heavy lifting in four stages:

1. Resume ingestion and text extraction:
- Accepts multiple resume files in a single request.
- Validates file formats and stores files with unique names.
- Extracts text from PDF, DOCX, TXT, and image-based resumes.

2. Candidate profile understanding:
- Builds structured candidate profiles from raw resume text.
- Extracts core fields such as skills, experience highlights, and project details.

3. Semantic matching and scoring:
- Compares candidate profiles against the job description semantically (meaning-based, not keyword-only).
- Produces relevance scores and normalized rankings.

4. Recruiter-friendly presentation:
- Frontend dashboard supports upload, JD input, and ranking review.
- Displays results in a clear, decision-oriented format for faster shortlisting.

## Core Features

- Bulk resume upload endpoint
- Health check endpoint
- Candidate ranking endpoint (`/api/v1/rank-candidates`)
- Job management endpoints (create job, upload candidates, list jobs)
- CORS-enabled API for frontend integration
- File validation for `.pdf`, `.doc`, `.docx`, `.txt`, `.jpg`, `.jpeg`, `.png`
- OCR-compatible extraction path for image resumes
- Modular service architecture for future NLP/LLM enhancements

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
    jobs.py
    rank_candidates.py
    resumes.py
  services/
    candidate_profile_service.py
    experience_extraction_service.py
    name_extraction_service.py
    project_extraction_service.py
    resume_service.py
    semantic_embedding_service.py
    semantic_matching_service.py
    semantic_ranking_service.py
    skill_extraction_service.py
    text_extraction_service.py
  utils/
    file_handler.py
    profile_formatter.py
    similarity_utils.py
    text_cleaner.py
frontend/
tests/
requirements.txt
README.md
```

## Technology Stack

- Backend: FastAPI, Pydantic, Uvicorn
- Frontend: React, Vite, Tailwind CSS
- AI/NLP layer: semantic embedding and matching services
- Optional OCR integration: `pytesseract` + system Tesseract

## Setup

1. Create and activate a Python virtual environment (Python 3.11 recommended).
2. Install backend dependencies:

```bash
pip install -r requirements.txt
```

3. Run backend:

```bash
uvicorn app.main:app --reload
```

4. Run frontend:

```bash
cd frontend
npm install
npm run dev
```

5. Open application and API docs:

- Frontend: `http://localhost:5173`
- Swagger UI: `http://127.0.0.1:8000/docs`
- ReDoc: `http://127.0.0.1:8000/redoc`

## API Endpoints

- `GET /health`
  - Returns service status.

- `POST /api/v1/resumes/bulk-upload`
  - Upload multiple resumes with form field `files`.
  - Stores files and returns upload metadata.

- `POST /api/v1/rank-candidates`
  - Accepts candidate profiles + job description text.
  - Returns ranked candidates with scores.

- `POST /api/v1/jobs/create`
  - Creates a job batch entry.

- `POST /api/v1/jobs/{job_id}/upload`
  - Adds candidate profiles to an existing job.

- `GET /api/v1/jobs`
  - Lists all jobs with candidate counts.

- `GET /api/v1/jobs/{job_id}/candidates`
  - Returns stored candidates for a specific job.

## OCR Prerequisite

`pytesseract` requires the Tesseract OCR engine installed on your machine.

- Windows: install Tesseract and add its install directory to PATH.
- If Tesseract is unavailable, image extraction paths return safe fallback output.



## Future Improvements

- Add authentication and role-based access control
- Persist jobs and candidates in a relational database
- Add model explainability signals for ranking transparency
- Add background processing queues for large resume batches

![Project Screenshot](Screenshot(395).png)
