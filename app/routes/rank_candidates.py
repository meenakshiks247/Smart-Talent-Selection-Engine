from __future__ import annotations

from typing import Any

from fastapi import APIRouter, HTTPException, status
from pydantic import ValidationError

from app.models.schemas import (
    CandidateProfileInput,
    RankCandidatesRequest,
    RankCandidatesResponse,
)
from app.services.semantic_ranking_service import rank_candidates


router = APIRouter(tags=["ranking"])


@router.post(
    "/rank-candidates",
    response_model=RankCandidatesResponse,
    status_code=status.HTTP_200_OK,
)
async def rank_candidates_endpoint(payload: RankCandidatesRequest) -> RankCandidatesResponse:
    valid_candidates: list[dict[str, Any]] = []
    skipped_candidates: list[dict[str, Any]] = []

    for index, candidate in enumerate(payload.candidates):
        try:
            parsed_candidate = CandidateProfileInput.model_validate(candidate)
            valid_candidates.append(parsed_candidate.model_dump())
        except ValidationError as exc:
            skipped_candidates.append(
                {
                    "index": index,
                    "error": "Invalid candidate profile. Candidate was skipped.",
                    "details": exc.errors(),
                }
            )

    try:
        ranked_candidates = rank_candidates(valid_candidates, payload.jd_text)
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to rank candidates.",
        ) from exc

    return RankCandidatesResponse(
        ranked_candidates=ranked_candidates,
        skipped_candidates=skipped_candidates,
    )