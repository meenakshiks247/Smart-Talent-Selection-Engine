import re


def extract_name(text: str) -> str:
    """Extract candidate name from the top of a resume.

    Strategy:
    - Find the first non-empty line.
    - Remove numbers and special characters.
    - Return a clean string.
    """
    if not text or not text.strip():
        return ""

    first_line = _get_first_non_empty_line(text)
    if not first_line:
        return ""

    return _clean_name_line(first_line)


def _get_first_non_empty_line(text: str) -> str:
    lines = text.replace("\r\n", "\n").replace("\r", "\n").split("\n")

    for line in lines:
        candidate = line.strip()
        if candidate:
            return candidate

    return ""


def _clean_name_line(line: str) -> str:
    # Keep letters and spaces, then normalize extra spacing.
    cleaned = re.sub(r"[^A-Za-z\s]", " ", line)
    cleaned = re.sub(r"\s+", " ", cleaned).strip()
    return cleaned