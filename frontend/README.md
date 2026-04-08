# Smart Talent Selection Engine Frontend

Beginner-friendly React frontend built with Vite, functional components, and Tailwind CSS.

## Tech Stack

- React (functional components only)
- Vite
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

## Build and Lint

```bash
npm run build
npm run lint
```

## Current Starter Flow

1. Upload resume files in the upload section.
2. Paste a job description in the input section.
3. Click **Analyze Candidates** to preview starter ranking results.

This is intentionally simple so backend API integration can be added in `src/services/apiClient.js` later.
