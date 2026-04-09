# Smart Talent Selection Engine Frontend

Beginner-friendly React frontend built with Vite, functional components, and Tailwind CSS.

## Tech Stack

- React (functional components only)
- Vite
- Axios
- Tailwind CSS
- ESLint

## Folder Structure

```text
frontend/
	src/
		components/
			AppLayout.jsx
			ResumeUploadSection.jsx
			ResumeUploader.jsx
			JobDescriptionSection.jsx
			JobDescriptionInput.jsx
			RankingResultsSection.jsx
		pages/
			DashboardPage.jsx
		services/
			apiClient.js
		utils/
			mockData.js
			formatScore.js
		App.jsx
		main.jsx
		index.css
```

## Tailwind Setup

Tailwind is configured through:

- `tailwindcss` and `@tailwindcss/postcss` packages
- `postcss.config.js`
- `tailwind.config.js`
- `src/index.css` with `@import "tailwindcss";`

## Run Locally

```bash
npm install
npm run dev
```

Open the printed local URL (usually `http://localhost:5173`).

## Mock Data Toggle

For quick UI testing without the backend, set `VITE_USE_MOCK_DATA=true` in a local `.env` file.

The included [.env.example](.env.example) contains live API defaults:

- `VITE_API_BASE_URL=http://localhost:8000/api/v1`
- `VITE_USE_MOCK_DATA=false`

Set `VITE_USE_MOCK_DATA=false` to use the live API flow.

## Build and Lint

```bash
npm run build
npm run lint
```

## Current End-to-End Flow

1. Upload resume files in the upload section.
2. Paste a job description in the input section.
3. Click **Analyze Candidates** to:
	- send files to backend bulk upload
	- extract text and build candidate profiles
	- call ranking API with job description + candidate profiles
4. Review ranked candidates, recruiter insights, and comparison panel.
