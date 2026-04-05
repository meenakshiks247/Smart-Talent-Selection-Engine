from app.services.skill_extraction_service import extract_skills


def test_extract_skills_maps_synonyms_to_standard_names() -> None:
    text = "Built apps with JS, React.js, Node, ML, and DL."

    assert extract_skills(text) == [
        "JavaScript",
        "React",
        "Node.js",
        "Machine Learning",
        "Deep Learning",
    ]


def test_extract_skills_avoids_duplicates_and_handles_case() -> None:
    text = "PYTHON python PyThOn, javascript JS, docker DOCKER"

    assert extract_skills(text) == ["Python", "JavaScript", "Docker"]


def test_extract_skills_returns_empty_for_blank_or_no_match() -> None:
    assert extract_skills("   ") == []
    assert extract_skills("No technical tools mentioned here") == []


def test_extract_skills_does_not_match_partial_words() -> None:
    text = "We use javascript heavily"

    assert extract_skills(text) == ["JavaScript"]