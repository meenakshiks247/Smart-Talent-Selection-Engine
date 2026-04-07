from typing import Any

from pydantic import BaseModel, ConfigDict, Field


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


class CandidateProfileInput(BaseModel):
    model_config = ConfigDict(extra="allow")

    name: str = ""
    skills: list[str] = Field(default_factory=list)
    experience_years: int | float = 0
    projects: list[str] = Field(default_factory=list)
    extracted_text: str = ""


class RankCandidatesRequest(BaseModel):
    jd_text: str
    candidates: list[Any]


class CandidateRankBreakdown(BaseModel):
    semantic_similarity: float
    skill_match_score: float
    experience_score: float
    matched_skills: list[str]
    jd_skills: list[str]
    weights: dict[str, float]


class RankedCandidate(BaseModel):
    name: str
    skills: list[str]
    experience_years: int | float
    projects: list[str]
    extracted_text: str
    fit_summary: str
    score: float
    score_breakdown: CandidateRankBreakdown


class RankCandidatesResponse(BaseModel):
    ranked_candidates: list[RankedCandidate]
    skipped_candidates: list[dict[str, Any]] = Field(default_factory=list)
