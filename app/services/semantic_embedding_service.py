import logging


logger = logging.getLogger(__name__)

MODEL_NAME = "all-MiniLM-L6-v2"

_MODEL = None
_MODEL_LOAD_ATTEMPTED = False


def _load_model():
    global _MODEL
    global _MODEL_LOAD_ATTEMPTED

    if _MODEL is not None:
        return _MODEL

    if _MODEL_LOAD_ATTEMPTED:
        return None

    _MODEL_LOAD_ATTEMPTED = True

    try:
        from sentence_transformers import SentenceTransformer

        _MODEL = SentenceTransformer(MODEL_NAME)
        return _MODEL
    except Exception:
        logger.error("Failed to load semantic embedding model '%s'.", MODEL_NAME, exc_info=True)
        return None


def get_embedding(text: str) -> list[float]:
    """Return an embedding vector for a single text input.

    Returns an empty list if the model cannot be loaded or encoding fails.
    """
    if not text or not text.strip():
        return []

    model = _load_model()
    if model is None:
        return []

    try:
        embedding = model.encode(text, convert_to_numpy=True)
        return embedding.tolist()
    except Exception:
        logger.error("Failed to generate embedding for input text.", exc_info=True)
        return []


def get_embeddings(texts: list[str]) -> list[list[float]]:
    """Return embeddings for a batch of text inputs.

    Returns an empty list if the model cannot be loaded or encoding fails.
    """
    if not texts:
        return []

    model = _load_model()
    if model is None:
        return []

    normalized_texts = [text if isinstance(text, str) and text.strip() else "" for text in texts]

    try:
        embeddings = model.encode(normalized_texts, convert_to_numpy=True)
        return embeddings.tolist()
    except Exception:
        logger.error("Failed to generate embeddings for batch input.", exc_info=True)
        return []