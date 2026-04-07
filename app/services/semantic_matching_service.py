from __future__ import annotations

import logging

from app.services.semantic_embedding_service import get_embedding
from app.utils.similarity_utils import cosine_similarity


logger = logging.getLogger(__name__)


def calculate_similarity(resume_text: str, jd_text: str, candidate_name: str = "") -> float:
    """Compare a resume with a job description and return a score from 0 to 100."""
    if not resume_text or not resume_text.strip():
        return 0.0

    if not jd_text or not jd_text.strip():
        return 0.0

    try:
        resume_embedding = get_embedding(resume_text, candidate_name=candidate_name)
        jd_embedding = get_embedding(jd_text, candidate_name="job_description")
    except Exception:
        logger.error("Embedding generation failed for candidate '%s'.", candidate_name or "unknown", exc_info=True)
        return 0.0

    if not resume_embedding or not jd_embedding:
        return 0.0

    try:
        cosine_score = cosine_similarity(resume_embedding, jd_embedding)
        similarity_score = ((cosine_score + 1.0) / 2.0) * 100.0
        bounded_score = max(0.0, min(100.0, float(similarity_score)))
        logger.info(
            "Similarity score calculated for candidate '%s': %.2f",
            candidate_name or "unknown",
            bounded_score,
        )
        return bounded_score
    except Exception:
        logger.error(
            "Similarity calculation failed for candidate '%s'.",
            candidate_name or "unknown",
            exc_info=True,
        )
        return 0.0