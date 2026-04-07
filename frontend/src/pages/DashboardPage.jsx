import { useState } from 'react'
import AppLayout from '../components/AppLayout'
import JobDescriptionSection from '../components/JobDescriptionSection'
import RankingResultsSection from '../components/RankingResultsSection'
import ResumeUploadSection from '../components/ResumeUploadSection'
import { sampleCandidates, sampleJobDescription } from '../utils/mockData'

function DashboardPage() {
  const [jobDescription, setJobDescription] = useState(sampleJobDescription)

  function handleAnalyzeCandidates() {
    // Placeholder for upcoming API integration.
    return null
  }

  return (
    <AppLayout>
      <div className="grid gap-6 lg:grid-cols-2">
        <ResumeUploadSection />
        <JobDescriptionSection
          value={jobDescription}
          onChange={(event) => setJobDescription(event.target.value)}
        />
      </div>

      <div className="mt-8 flex justify-center">
        <button
          type="button"
          onClick={handleAnalyzeCandidates}
          className="rounded-lg bg-slate-900 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800"
        >
          Analyze Candidates
        </button>
      </div>

      <div className="mt-8">
        <RankingResultsSection candidates={sampleCandidates} />
      </div>
    </AppLayout>
  )
}

export default DashboardPage