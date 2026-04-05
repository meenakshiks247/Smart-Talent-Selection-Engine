import re

from app.utils.text_cleaner import clean_resume_text


EXPERIENCE_PATTERN = re.compile(
    r"(?:over\s*)?(\d+(?:\.\d+)?)\s*\+?\s*years?",
    flags=re.IGNORECASE,
)


def extract_experience(text: str) -> int | float:
    """Extract the maximum years of experience from resume text.

    Supported examples include:
    - 2 years
    - 3+ years
    - 1.5 years
    - over 4 years

    Returns 0 when no experience value is detected.
    """
    if not text or not text.strip():
        return 0

    cleaned_text = clean_resume_text(text)
    if not cleaned_text:
        return 0

    matches = EXPERIENCE_PATTERN.findall(cleaned_text)

    if not matches:
        return 0

    values = [float(value) for value in matches]
    max_value = max(values)

    if max_value.is_integer():
        return int(max_value)

    return max_value