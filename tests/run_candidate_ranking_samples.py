import json
import sys
from pathlib import Path


PROJECT_ROOT = Path(__file__).resolve().parents[1]
if str(PROJECT_ROOT) not in sys.path:
    sys.path.insert(0, str(PROJECT_ROOT))

from app.services.semantic_ranking_service import rank_candidates


def main() -> None:
    jd_text = """
    Backend Engineer

    We are looking for someone with Python, FastAPI, REST APIs, Docker, and SQL experience.
    Strong problem-solving skills and experience building production-ready backend services are preferred.
    """

    candidates = [
        {
            "name": "John Smith",
            "skills": ["Python", "FastAPI", "Docker", "AWS"],
            "experience_years": 4,
            "projects": ["Resume Parser API", "Deployment Automation"],
            "extracted_text": (
                "Backend developer with 4 years of experience building Python and FastAPI services. "
                "Worked on Docker-based deployments and REST API integrations."
            ),
        },
        {
            "name": "Aisha Khan",
            "skills": ["Python", "SQL", "Machine Learning"],
            "experience_years": 2,
            "projects": ["Analytics Dashboard", "Recommendation Engine"],
            "extracted_text": (
                "Software engineer with Python and SQL experience. Built data-driven applications and "
                "worked on backend tooling for analytics workflows."
            ),
        },
        {
            "name": "Michael Chen",
            "skills": ["Java", "Spring Boot", "REST APIs", "Docker"],
            "experience_years": 6,
            "projects": ["Order Service", "API Gateway"],
            "extracted_text": (
                "Backend engineer with 6 years of experience in REST APIs, Docker, and service design. "
                "Built and maintained production backend systems."
            ),
        },
    ]

    ranked_candidates = rank_candidates(candidates, jd_text)

    print("Ranked Candidates")
    print(json.dumps(ranked_candidates, indent=2))

    print("\nReadable Summary")
    for index, candidate in enumerate(ranked_candidates, start=1):
        print(f"{index}. {candidate['name']}")
        print(f"   Score: {candidate['score']}")
        print(f"   Justification: {candidate['fit_summary']}")


if __name__ == "__main__":
    main()