from pathlib import Path
from uuid import uuid4

from fastapi import HTTPException, UploadFile


ALLOWED_EXTENSIONS = {".pdf", ".doc", ".docx", ".txt", ".jpg", ".jpeg", ".png"}


async def save_upload_file(upload_dir: Path, upload_file: UploadFile) -> tuple[str, int]:
    filename = upload_file.filename or ""
    extension = Path(filename).suffix.lower()

    if extension not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail=(
                f"Unsupported file type for '{filename}'. "
                f"Allowed types: {', '.join(sorted(ALLOWED_EXTENSIONS))}."
            ),
        )

    upload_dir.mkdir(parents=True, exist_ok=True)

    unique_name = f"{uuid4().hex}{extension}"
    output_path = upload_dir / unique_name

    content = await upload_file.read()
    file_size = len(content)

    with output_path.open("wb") as destination:
        destination.write(content)

    await upload_file.close()

    return unique_name, file_size
