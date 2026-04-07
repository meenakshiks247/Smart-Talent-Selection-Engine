import re

from app.utils.text_cleaner import clean_resume_text


CANONICAL_SKILLS = [
    "Python",
    "Java",
    "C++",
    "JavaScript",
    "React.js",
    "Node.js",
    "HTML",
    "CSS",
    "SQL",
    "PostgreSQL",
    "MongoDB",
    "Machine Learning",
    "Kubernetes",
    "Google Cloud",
    "Amazon Web Services",
    "Backend Development",
    "Docker",
    "Git",
]

SKILL_SYNONYMS = {
    "jvm": "Java",
    "pytorch": "Machine Learning",
    "tensorflow": "Machine Learning",
    "react": "React.js",
    "reactjs": "React.js",
    "nodejs": "Node.js",
    "node": "Node.js",
    "postgres": "PostgreSQL",
    "mongo": "MongoDB",
    "k8s": "Kubernetes",
    "gcp": "Google Cloud",
    "aws": "Amazon Web Services",
    "backend specialist": "Backend Development",
}


_CANONICAL_BY_LOWER = {skill.lower(): skill for skill in CANONICAL_SKILLS}
_DETECTION_TERMS = sorted(
    set(_CANONICAL_BY_LOWER.keys()) | set(SKILL_SYNONYMS.keys()) | {"js", "ml", "tf"},
    key=len,
    reverse=True,
)


def extract_skills(text: str) -> list[str]:
    """Extract and normalize technical skills from resume text.

    Matching and normalization are case-insensitive and output uses
    canonical skill names from CANONICAL_SKILLS.
    """
    if not text or not text.strip():
        return []

    normalized_text = clean_resume_text(text)
    if not normalized_text:
        return []

    matched_tokens: list[str] = []

    for term in _DETECTION_TERMS:
        if _contains_term(normalized_text, term):
            matched_tokens.append(term)

    canonical_skills: list[str] = []
    for token in matched_tokens:
        canonical_skill = _normalize_skill_token(token)
        if canonical_skill and canonical_skill not in canonical_skills:
            canonical_skills.append(canonical_skill)

    return canonical_skills


def _normalize_skill_token(token: str) -> str:
    lowered_token = token.lower()

    if lowered_token in SKILL_SYNONYMS:
        return SKILL_SYNONYMS[lowered_token]

    if lowered_token == "js":
        return "JavaScript"

    if lowered_token in {"ml", "tf"}:
        return "Machine Learning"

    return _CANONICAL_BY_LOWER.get(lowered_token, "")


def _contains_term(normalized_text: str, term: str) -> bool:
    escaped_term = re.escape(term.lower())
    pattern = rf"(?<!\w){escaped_term}(?!\w)"
    return re.search(pattern, normalized_text) is not None