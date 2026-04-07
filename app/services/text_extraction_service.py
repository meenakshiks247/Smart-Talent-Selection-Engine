# requirements: pytesseract, Pillow

import importlib
import re
from pathlib import Path


PDF_EXTENSIONS = {".pdf"}
DOCX_EXTENSIONS = {".docx"}
IMAGE_EXTENSIONS = {".jpg", ".jpeg", ".png"}


def extract_text_from_file(file_path: str | Path) -> str:
    """Extract text from supported file types.

    Supported:
    - PDF via pdfplumber
    - DOCX via python-docx
    - JPG/JPEG/PNG via pytesseract + Pillow

    Raises:
    - ValueError for unsupported file types
    """
    path = Path(file_path)

    if not path.exists() or not path.is_file():
        return ""

    extension = path.suffix.lower()

    if extension in PDF_EXTENSIONS:
        extractor = _extract_from_pdf
    elif extension in DOCX_EXTENSIONS:
        extractor = _extract_from_docx
    elif extension in IMAGE_EXTENSIONS:
        extractor = _extract_from_image
    else:
        raise ValueError(f"Unsupported file format: {extension or 'unknown'}")

    try:
        extracted_text = extractor(path)
        return _clean_text(extracted_text)
    except Exception:
        return ""


def _extract_from_pdf(path: Path) -> str:
    pdfplumber = importlib.import_module("pdfplumber")

    pages_text: list[str] = []

    with pdfplumber.open(path) as pdf:
        for page in pdf.pages:
            pages_text.append(page.extract_text() or "")

    return "\n".join(pages_text)


def _extract_from_docx(path: Path) -> str:
    docx = importlib.import_module("docx")

    document = docx.Document(path)
    paragraphs = [paragraph.text for paragraph in document.paragraphs]
    return "\n".join(paragraphs)


def _extract_from_image(path: Path) -> str:
    pytesseract = importlib.import_module("pytesseract")
    pil_image_module = importlib.import_module("PIL.Image")

    with pil_image_module.open(path) as image:
        return pytesseract.image_to_string(image)


def _clean_text(text: str) -> str:
    # Keep paragraph-style new lines but collapse noisy spacing.
    text = text.replace("\r\n", "\n").replace("\r", "\n")
    text = re.sub(r"[\t\f\v]+", " ", text)
    text = re.sub(r"\n{3,}", "\n\n", text)
    text = re.sub(r"[ ]{2,}", " ", text)
    return text.strip()
