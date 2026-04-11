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

## Workflow

The platform supports two practical recruiter workflows:

### 1) Resume Ingestion and Profile Extraction

1. Recruiter uploads one or more resumes from the frontend.
2. Frontend calls `POST /api/v1/resumes/bulk-upload`.
3. Backend validates and stores files in `uploads/`.
4. `text_extraction_service` extracts text from supported formats.
5. `candidate_profile_service` derives structured fields (name, skills, experience, projects).
6. API returns extraction status and candidate preview data for UI display.

### 2) Candidate Ranking Against Job Description

1. Recruiter provides a job description and candidate profiles.
2. Frontend calls `POST /api/v1/rank-candidates`.
3. Backend validates each candidate payload (`CandidateProfileInput`).
4. `semantic_ranking_service` computes:
   - semantic similarity (`semantic_matching_service`)
   - skill match score (`skill_extraction_service` + overlap scoring)
   - experience score (normalized years)
5. Weighted final score is calculated and candidates are sorted descending.
6. Top candidates may receive improved two-sentence fit summaries if `OPENAI_API_KEY` is configured.
7. Ranked output with score breakdown is returned to the frontend.

### Optional Job-Batch Workflow

1. Create a job via `POST /api/v1/jobs/create`.
2. Attach candidate profiles via `POST /api/v1/jobs/{job_id}/upload`.
3. Review jobs and candidate pools via `GET /api/v1/jobs` and `GET /api/v1/jobs/{job_id}/candidates`.

## Architecture

The codebase follows a modular, layered architecture to keep API handlers thin and business logic isolated in services.

```text
Frontend (React + Vite)
  |
  | HTTP (Axios)
  v
FastAPI App (app/main.py)
  |
  +-- API Router (app/api/router.py)
       |
       +-- Health Route (app/routes/health.py)
       +-- Resume Route (app/routes/resumes.py)
       |     -> Resume Service
       |        -> File Handler Utils
       |        -> Text Extraction Service
       |        -> Candidate Profile Service
       |
       +-- Ranking Route (app/routes/rank_candidates.py)
       |     -> Semantic Ranking Service
       |        -> Semantic Matching Service
       |        -> Skill Extraction Service
       |
       +-- Jobs Route (app/routes/jobs.py)
             -> JSON File Store (jobs_store.json)

Shared Layers
  - Pydantic Schemas (app/models/schemas.py)
  - Utility Helpers (app/utils/*)
  - Uploaded Files (uploads/)
```

### Architectural Principles Used

- Route-first API design: endpoint modules are grouped by domain (`resumes`, `ranking`, `jobs`).
- Service isolation: NLP/extraction/scoring logic lives in `app/services/`.
- Schema-driven contracts: request/response validation is centralized in Pydantic models.
- Replaceable AI components: embedding/matching/ranking services are modular for future model upgrades.
- Frontend/backend separation: React UI communicates with FastAPI over versioned REST endpoints.

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


