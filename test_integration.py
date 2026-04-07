import requests


BASE_URL = "http://localhost:8000"


def create_job() -> dict:
    url = f"{BASE_URL}/api/v1/jobs/create"
    payload = {
        "role_title": "Backend Engineer",
        "batch_date": "2026-04-07",
    }

    response = requests.post(url, json=payload, timeout=30)
    response.raise_for_status()
    return response.json()


def rank_candidates() -> dict:
    url = f"{BASE_URL}/api/v1/rank-candidates"

    jd_text = (
        "We are hiring a Backend Engineer with strong Python and API development skills. "
        "Candidates should have experience building scalable backend systems, working with SQL databases, "
        "and deploying services using Docker or cloud platforms."
    )

    resume_text_1 = (
        "Riya Sharma is a Backend Developer with 4 years of experience in Python, FastAPI, SQL, and Docker. "
        "She built microservices for payment processing and optimized API performance for high-traffic systems."
    )

    resume_text_2 = (
        "Arjun Mehta is a Software Engineer with 2 years of experience in JavaScript, React, and Node.js. "
        "He has worked on web dashboards and internal tooling with limited backend API exposure."
    )

    payload = {
        "jd_text": jd_text,
        "candidates": [
            {
                "name": "Riya Sharma",
                "skills": ["Python", "FastAPI", "SQL", "Docker"],
                "experience_years": 4,
                "projects": ["Payment API Platform", "Resume Parser Service"],
                "extracted_text": resume_text_1,
            },
            {
                "name": "Arjun Mehta",
                "skills": ["JavaScript", "React.js", "Node.js"],
                "experience_years": 2,
                "projects": ["Admin Dashboard", "Internal Tooling"],
                "extracted_text": resume_text_2,
            },
        ],
    }

    response = requests.post(url, json=payload, timeout=60)
    response.raise_for_status()
    return response.json()


def list_jobs() -> dict:
    url = f"{BASE_URL}/api/v1/jobs"
    response = requests.get(url, timeout=30)
    response.raise_for_status()
    return response.json()


def main() -> None:
    print("1) Creating job role...")
    job_result = create_job()
    print(job_result)

    print("\n2) Ranking 2 sample candidates against JD...")
    ranking_result = rank_candidates()

    ranked_candidates = ranking_result.get("ranked_candidates", [])
    print("\nRanked Candidates")
    for index, candidate in enumerate(ranked_candidates, start=1):
        print(f"{index}. {candidate.get('name', '')}")
        print(f"   Score: {candidate.get('score', 0)}")
        print(f"   Fit Summary: {candidate.get('fit_summary', '')}")

    skipped_candidates = ranking_result.get("skipped_candidates", [])
    if skipped_candidates:
        print("\nSkipped Candidates")
        for skipped in skipped_candidates:
            print(skipped)

    print("\n3) Listing all jobs...")
    jobs_result = list_jobs()
    print(jobs_result)


if __name__ == "__main__":
    main()
