from __future__ import annotations

import asyncio
import os
import re
from typing import Any

import openai

from app.services.semantic_matching_service import calculate_similarity
from app.services.skill_extraction_service import extract_skills


SEMANTIC_WEIGHT = 0.6
SKILL_WEIGHT = 0.25
EXPERIENCE_WEIGHT = 0.15


async def rank_candidates(candidates: list[dict[str, Any]], jd_text: str) -> list[dict[str, Any]]:
    """Rank candidates against a job description and return score breakdowns."""
    normalized_jd_text = jd_text.strip() if isinstance(jd_text, str) else ""
    jd_skills = _normalize_skills(extract_skills(normalized_jd_text)) if normalized_jd_text else []
    api_key = os.getenv("OPENAI_API_KEY")
    client = None

    if api_key:
        try:
            client = openai.OpenAI(api_key=api_key)
        except Exception:
            client = None

    ranked_candidates: list[dict[str, Any]] = []

    for candidate in candidates or []:
        candidate_data = candidate if isinstance(candidate, dict) else {}

        name = _normalize_text(candidate_data.get("name", ""))
        skills = _normalize_skills(candidate_data.get("skills", []))
        experience_years = _normalize_experience(candidate_data.get("experience_years", 0))
        projects = _normalize_list(candidate_data.get("projects", []))
        extracted_text = _normalize_text(candidate_data.get("extracted_text", ""))

        semantic_similarity = 0.0
        if extracted_text and normalized_jd_text:
            semantic_similarity = calculate_similarity(extracted_text, normalized_jd_text)

        skill_match_score, matched_skills = _calculate_skill_match_score(skills, jd_skills)
        experience_score = _calculate_experience_score(experience_years)
        fit_summary = _build_fit_summary(matched_skills, experience_years, projects, jd_skills)

        final_score = (
            semantic_similarity * SEMANTIC_WEIGHT
            + skill_match_score * SKILL_WEIGHT
            + experience_score * EXPERIENCE_WEIGHT
        )

        ranked_candidates.append(
            {
                "name": name,
                "skills": skills,
                "experience_years": experience_years,
                "projects": projects,
                "extracted_text": extracted_text,
                "fit_summary": fit_summary,
                "score": round(max(0.0, min(100.0, final_score)), 2),
                "score_breakdown": {
                    "semantic_similarity": round(semantic_similarity, 2),
                    "skill_match_score": round(skill_match_score, 2),
                    "experience_score": round(experience_score, 2),
                    "matched_skills": matched_skills,
                    "jd_skills": jd_skills,
                    "weights": {
                        "semantic": SEMANTIC_WEIGHT,
                        "skills": SKILL_WEIGHT,
                        "experience": EXPERIENCE_WEIGHT,
                    },
                },
            }
        )

    ranked_candidates = sorted(ranked_candidates, key=lambda item: item["score"], reverse=True)

    for rank, candidate in enumerate(ranked_candidates, start=1):
        if rank > 5 or client is None:
            continue

        fallback_summary = candidate["fit_summary"]
        candidate_prompt = _build_llm_summary_prompt(
            candidate_name=candidate["name"],
            skills=candidate["skills"],
            experience_years=candidate["experience_years"],
            jd_text=normalized_jd_text,
        )

        try:
            response = await asyncio.to_thread(
                client.chat.completions.create,
                model="gpt-3.5-turbo",
                messages=[
                    {
                        "role": "system",
                        "content": "You write concise candidate fit summaries for recruiters.",
                    },
                    {
                        "role": "user",
                        "content": candidate_prompt,
                    },
                ],
                temperature=0.3,
                max_tokens=120,
            )

            summary = ""
            if response.choices and response.choices[0].message and response.choices[0].message.content:
                summary = response.choices[0].message.content.strip()

            summary = _limit_to_two_sentences(summary)
            if summary:
                candidate["fit_summary"] = summary
        except Exception:
            candidate["fit_summary"] = fallback_summary

    return ranked_candidates


def _calculate_skill_match_score(candidate_skills: list[str], jd_skills: list[str]) -> tuple[float, list[str]]:
    if not candidate_skills or not jd_skills:
        return 0.0, []

    candidate_skill_set = {skill.lower() for skill in candidate_skills}
    matched_skills = [skill for skill in jd_skills if skill.lower() in candidate_skill_set]

    if not matched_skills:
        return 0.0, []

    score = (len(matched_skills) / len(jd_skills)) * 100.0
    return min(100.0, score), matched_skills


def _calculate_experience_score(experience_years: int | float) -> float:
    if not isinstance(experience_years, (int, float)):
        return 0.0

    normalized_years = max(0.0, float(experience_years))
    return min(100.0, (normalized_years / 10.0) * 100.0)


def _build_fit_summary(
    matched_skills: list[str],
    experience_years: int | float,
    projects: list[str],
    jd_skills: list[str],
) -> str:
    skill_phrase = _format_skill_phrase(matched_skills)
    experience_phrase = _format_experience_phrase(experience_years)
    strength_phrase = _format_strength_phrase(projects, jd_skills)

    first_sentence = f"Strong match for the role with {skill_phrase}." if skill_phrase else "Relevant background for the role."

    if experience_phrase and strength_phrase:
        second_sentence = f"{experience_phrase} and {strength_phrase}."
    elif experience_phrase:
        second_sentence = f"{experience_phrase}."
    elif strength_phrase:
        second_sentence = f"{strength_phrase}."
    else:
        second_sentence = ""

    summary = f"{first_sentence} {second_sentence}".strip()
    if not summary.endswith("."):
        summary += "."

    return summary


def _build_llm_summary_prompt(
    candidate_name: str,
    skills: list[str],
    experience_years: int | float,
    jd_text: str,
) -> str:
    top_skills = ", ".join(skills[:5]) if skills else "none listed"
    experience_label = f"{experience_years:g} years" if isinstance(experience_years, (int, float)) else "unknown experience"

    return (
        f"Write exactly 2 sentences explaining why {candidate_name or 'this candidate'} fits the job description. "
        f"Mention the candidate's top skills ({top_skills}), their experience ({experience_label}), and the job description below. "
        f"Do not add bullet points or headings.\n\n"
        f"Job description:\n{jd_text}"
    )


def _limit_to_two_sentences(text: str) -> str:
    if not text:
        return ""

    sentences = re.split(r"(?<=[.!?])\s+", text.strip())
    summary = " ".join(sentence.strip() for sentence in sentences[:2] if sentence.strip())
    return summary.strip()


def _format_skill_phrase(matched_skills: list[str]) -> str:
    if not matched_skills:
        return "relevant skills"

    if len(matched_skills) == 1:
        return matched_skills[0]

    if len(matched_skills) == 2:
        return f"{matched_skills[0]} and {matched_skills[1]}"

    return f"{', '.join(matched_skills[:2])}, and other relevant skills"


def _format_experience_phrase(experience_years: int | float) -> str:
    if experience_years <= 0:
        return ""

    if experience_years >= 3:
        return f"Has {experience_years:g}+ years of experience"

    return f"Has {experience_years:g} years of experience"


def _format_strength_phrase(projects: list[str], jd_skills: list[str]) -> str:
    if projects:
        return "brings relevant project work"

    if jd_skills:
        return "aligns with the job description requirements"

    return "shows overall role alignment"


def _normalize_text(value: Any) -> str:
    return value.strip() if isinstance(value, str) else ""


def _normalize_skills(value: Any) -> list[str]:
    if not isinstance(value, list):
        return []

    skills = [str(skill).strip() for skill in value if str(skill).strip()]
    return list(dict.fromkeys(skills))


def _normalize_list(value: Any) -> list[str]:
    if not isinstance(value, list):
        return []

    return [str(item).strip() for item in value if str(item).strip()]


def _normalize_experience(value: Any) -> int | float:
    if isinstance(value, (int, float)):
        return value

    try:
        return float(value)
    except (TypeError, ValueError):
        return 0