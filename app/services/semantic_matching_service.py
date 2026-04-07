from __future__ import annotations

from app.services.semantic_embedding_service import get_embedding
from app.utils.similarity_utils import cosine_similarity


def calculate_similarity(resume_text: str, jd_text: str) -> float:
    """Compare a resume with a job description and return a score from 0 to 100."""
    if not resume_text or not resume_text.strip():
        return 0.0

    if not jd_text or not jd_text.strip():
        return 0.0

    resume_embedding = get_embedding(resume_text)
    jd_embedding = get_embedding(jd_text)

    cosine_score = cosine_similarity(resume_embedding, jd_embedding)
    similarity_score = ((cosine_score + 1.0) / 2.0) * 100.0

    return max(0.0, min(100.0, float(similarity_score)))