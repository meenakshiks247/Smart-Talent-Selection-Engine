import re


PROJECT_SECTION_HEADERS = [
    "projects",
    "academic projects",
    "personal projects",
]

COMMON_SECTION_HEADERS = [
    "summary",
    "experience",
    "work experience",
    "education",
    "skills",
    "technical skills",
    "certifications",
    "achievements",
    "internships",
]


def extract_projects(text: str) -> list[str]:
    """Extract project lines under project-related sections from resume text.

    The extraction is keyword-based and keeps the logic beginner-friendly.
    """
    if not text or not text.strip():
        return []

    lines = [line.strip() for line in text.replace("\r\n", "\n").replace("\r", "\n").split("\n")]
    project_items: list[str] = []

    for index, line in enumerate(lines):
        if not _is_section_header(line, PROJECT_SECTION_HEADERS):
            continue

        next_index = index + 1
        while next_index < len(lines):
            current_line = lines[next_index].strip()

            if _is_section_header(current_line, PROJECT_SECTION_HEADERS + COMMON_SECTION_HEADERS):
                break

            cleaned_line = _clean_project_line(current_line)
            if cleaned_line:
                project_items.append(cleaned_line)

            next_index += 1

    return _deduplicate(project_items)


def _is_section_header(line: str, headers: list[str]) -> bool:
    cleaned = line.strip().rstrip(":").lower()
    return cleaned in headers


def _clean_project_line(line: str) -> str:
    if not line:
        return ""

    # Remove common bullet/number prefixes and keep short project text.
    cleaned = re.sub(r"^\s*(?:[-*•]+|\d+[.)])\s*", "", line).strip()
    return cleaned


def _deduplicate(items: list[str]) -> list[str]:
    seen: set[str] = set()
    unique_items: list[str] = []

    for item in items:
        key = item.lower()
        if key in seen:
            continue
        seen.add(key)
        unique_items.append(item)

    return unique_items