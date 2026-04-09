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


def test_extract_skills_does_not_detect_javascript_from_node_js_only() -> None:
    text = "Experienced with Node.js and backend APIs"

    assert extract_skills(text) == ["Node.js"]


def test_extract_skills_does_not_match_javascript_substrings() -> None:
    text = "Worked primarily with Node.js for backend services"

    assert "JavaScript" not in extract_skills(text)


def test_extract_skills_detects_standalone_js_alias_only() -> None:
    text = "Hands-on with JS and Node.js in production APIs"

    extracted = extract_skills(text)
    assert "Node.js" in extracted
    assert "JavaScript" in extracted
    assert extracted.count("JavaScript") == 1