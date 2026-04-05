import re


def clean_resume_text(text: str) -> str:
    """Clean resume text for simple extraction tasks.

    Steps:
    - Convert to lowercase
    - Remove unnecessary special characters
    - Remove extra spaces
    - Normalize line breaks
    """
    if not text or not text.strip():
        return ""

    cleaned_text = text.replace("\r\n", "\n").replace("\r", "\n").lower()

    # Keep letters, numbers, spaces, and a few useful symbols.
    cleaned_text = re.sub(r"[^\w\s.+#]", " ", cleaned_text)

    cleaned_text = re.sub(r"[ \t]+", " ", cleaned_text)
    cleaned_text = re.sub(r"\n{2,}", "\n", cleaned_text)
    cleaned_text = re.sub(r" *\n *", "\n", cleaned_text)

    return cleaned_text.strip()