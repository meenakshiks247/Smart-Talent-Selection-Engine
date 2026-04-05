import json
import sys
from pathlib import Path


PROJECT_ROOT = Path(__file__).resolve().parents[1]
if str(PROJECT_ROOT) not in sys.path:
    sys.path.insert(0, str(PROJECT_ROOT))

from app.services.candidate_profile_service import build_candidate_profile


def main() -> None:
    sample_resumes = [
        {
            "label": "Sample 1 - Full Stack",
            "text": """
            John D. Smith 2026
            Full Stack Developer

            Skills
            Python, JS, React.js, Node, Docker, AWS

            Experience
            Worked for 3+ years in full stack web development.

            Projects
            - Smart Talent Selection Engine: Built resume parsing APIs
            - Hiring Dashboard using React and FastAPI
            """,
        },
        {
            "label": "Sample 2 - Data Science",
            "text": """
            Alice Johnson
            Data Scientist

            Technical Skills
            Python, Machine Learning, DL, TensorFlow, PyTorch, SQL

            Professional Experience
            over 4 years in ML model building and deployment.

            Academic Projects
            * Sentiment Analysis for Product Reviews
            * Fraud Detection with Deep Learning
            """,
        },
        {
            "label": "Sample 3 - Backend",
            "text": """
            Michael-Roy 007
            Backend Engineer

            Skills
            Java, Node.js, MongoDB, Git, HTML, CSS

            Experience
            1.5 years in backend API development and testing.

            Personal Projects
            1) Expense Tracker API
            2) Inventory Management Service
            """,
        },
    ]

    for sample in sample_resumes:
        profile = build_candidate_profile(sample["text"])
        print(f"\n{sample['label']}")
        print(json.dumps(profile, indent=2))


if __name__ == "__main__":
    main()