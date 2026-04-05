def format_candidate_profile(
    name: str = "",
    skills: list[str] | None = None,
    experience_years: int | float = 0,
    projects: list[str] | None = None,
) -> dict[str, str | list[str] | int | float]:
    """Format candidate profile fields into a simple JSON-friendly dictionary."""
    formatted_name = name.strip() if isinstance(name, str) else ""
    formatted_skills = [str(skill).strip() for skill in (skills or []) if str(skill).strip()]
    formatted_projects = [
        str(project).strip() for project in (projects or []) if str(project).strip()
    ]

    numeric_experience: int | float = 0
    if isinstance(experience_years, (int, float)):
        numeric_experience = experience_years

    return {
        "name": formatted_name,
        "skills": formatted_skills,
        "experience_years": numeric_experience,
        "projects": formatted_projects,
    }