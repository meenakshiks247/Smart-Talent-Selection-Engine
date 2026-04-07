import re

from app.utils.text_cleaner import clean_resume_text


COMMON_SKILLS = [
    "Python",
    "Java",
    "C++",
    "JavaScript",
    "React",
    "Node.js",
    "HTML",
    "CSS",
    "SQL",
    "MongoDB",
    "Machine Learning",
    "Deep Learning",
    "TensorFlow",
    "PyTorch",
    "AWS",
    "Docker",
    "Git",
]

SKILL_SYNONYMS = {
    "Python": ["python"],
    "Java": ["java"],
    "C++": ["c++"],
    "JavaScript": ["javascript", "js"],
    "React": ["react", "react.js"],
    "Node.js": ["node.js", "node"],
    "HTML": ["html"],
    "CSS": ["css"],
    "SQL": ["sql"],
    "MongoDB": ["mongodb", "mongo"],
    "Machine Learning": ["machine learning", "ml"],
    "Deep Learning": ["deep learning", "dl"],
    "TensorFlow": ["tensorflow", "tf"],
    "PyTorch": ["pytorch"],
    "AWS": ["aws"],
    "Docker": ["docker"],
    "Git": ["git"],
}


def extract_skills(text: str) -> list[str]:
    """Extract predefined technical skills from resume text.

    Matching is case-insensitive, duplicates are removed, and output uses
    canonical skill names from COMMON_SKILLS.
    """
    if not text or not text.strip():
        return []

    normalized_text = clean_resume_text(text)
    if not normalized_text:
        return []

    detected_skills: list[str] = []

    for skill in COMMON_SKILLS:
        aliases = SKILL_SYNONYMS.get(skill, [skill.lower()])

        for alias in aliases:
            if _contains_term(normalized_text, skill, alias):
                detected_skills.append(skill)
                break

    return detected_skills


def _contains_term(normalized_text: str, skill: str, term: str) -> bool:
    escaped_term = re.escape(term.lower())
    pattern = rf"(?<!\w){escaped_term}(?!\w)"
    return re.search(pattern, normalized_text) is not None