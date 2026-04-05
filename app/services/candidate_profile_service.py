import logging

from app.services.experience_extraction_service import extract_experience
from app.services.name_extraction_service import extract_name
from app.services.project_extraction_service import extract_projects
from app.services.skill_extraction_service import extract_skills
from app.utils.profile_formatter import format_candidate_profile


logger = logging.getLogger(__name__)


def build_candidate_profile(text: str) -> dict[str, str | list[str] | int | float]:
    """Build a structured candidate profile from resume text.

    Returns a JSON-like dictionary with extracted fields.
    """
    normalized_text = text if isinstance(text, str) else ""

    name = _extract_name_optional(normalized_text)
    skills = _extract_skills(normalized_text)
    experience_years = _extract_experience(normalized_text)
    projects = _extract_projects(normalized_text)

    profile = format_candidate_profile(
        name=name,
        skills=skills,
        experience_years=experience_years,
        projects=projects,
    )

    return profile


def _extract_name_optional(text: str) -> str:
    # Keep this optional-style helper for easy future toggling.
    if not text.strip():
        return ""
    try:
        name = extract_name(text)
        logger.info("Name extraction result: %s", name)
        return name
    except Exception:
        logger.error("Name extraction failed due to parsing error.", exc_info=True)
        return ""


def _extract_skills(text: str) -> list[str]:
    try:
        skills = extract_skills(text)
        logger.info("Skill extraction succeeded. Detected %d skills.", len(skills))
        return skills
    except Exception:
        logger.error("Skill extraction failed due to parsing error.", exc_info=True)
        return []


def _extract_experience(text: str) -> int | float:
    try:
        experience_years = extract_experience(text)
        logger.info("Experience extraction result: %s years", experience_years)
        return experience_years
    except Exception:
        logger.error("Experience extraction failed due to parsing error.", exc_info=True)
        return 0


def _extract_projects(text: str) -> list[str]:
    try:
        projects = extract_projects(text)
        logger.info("Project extraction result count: %d", len(projects))
        return projects
    except Exception:
        logger.error("Project extraction failed due to parsing error.", exc_info=True)
        return []