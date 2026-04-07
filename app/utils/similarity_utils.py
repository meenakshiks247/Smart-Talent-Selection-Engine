from __future__ import annotations

import math
from collections.abc import Sequence


def cosine_similarity(vector_a: Sequence[float] | None, vector_b: Sequence[float] | None) -> float:
    """Calculate cosine similarity between two embedding vectors.

    Returns 0.0 for invalid, empty, or mismatched inputs.
    """
    if not _is_valid_vector(vector_a) or not _is_valid_vector(vector_b):
        return 0.0

    if len(vector_a) != len(vector_b):
        return 0.0

    dot_product = 0.0
    magnitude_a = 0.0
    magnitude_b = 0.0

    for value_a, value_b in zip(vector_a, vector_b):
        dot_product += value_a * value_b
        magnitude_a += value_a * value_a
        magnitude_b += value_b * value_b

    if magnitude_a == 0.0 or magnitude_b == 0.0:
        return 0.0

    similarity = dot_product / (math.sqrt(magnitude_a) * math.sqrt(magnitude_b))
    return max(-1.0, min(1.0, float(similarity)))


def _is_valid_vector(vector: Sequence[float] | None) -> bool:
    if vector is None or len(vector) == 0:
        return False

    for value in vector:
        if not isinstance(value, (int, float)):
            return False

    return True