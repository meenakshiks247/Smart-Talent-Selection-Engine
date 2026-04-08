import { useState } from 'react'
import CandidateResults from '../components/CandidateResults'
import AppLayout from '../components/AppLayout'
import JobDescriptionSection from '../components/JobDescriptionSection'
import ResumeUploadSection from '../components/ResumeUploadSection'
import { sampleCandidates, sampleJobDescription } from '../utils/mockData'

function DashboardPage() {
  const [jobDescription, setJobDescription] = useState(sampleJobDescription)
  const [selectedResumes, setSelectedResumes] = useState([])
  const [rankedCandidates, setRankedCandidates] = useState([])

  function handleAnalyzeCandidates() {
    // Placeholder behavior so the starter UI feels complete before backend wiring.
    if (selectedResumes.length === 0 || !jobDescription.trim()) {
      setRankedCandidates([])
      return
    }

    setRankedCandidates(sampleCandidates)
  }

  return (
    <AppLayout>
      <div className="grid gap-6 lg:grid-cols-2">
        <ResumeUploadSection onFilesChange={setSelectedResumes} />
        <JobDescriptionSection
          value={jobDescription}
          onChange={(event) => setJobDescription(event.target.value)}
        />
      </div>

      <div className="mt-8 flex justify-center">
        <button
          type="button"
          onClick={handleAnalyzeCandidates}
          disabled={selectedResumes.length === 0 || !jobDescription.trim()}
          className="rounded-lg bg-slate-900 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
        >
          Analyze Candidates
        </button>
      </div>

      <div className="mt-8">
        <CandidateResults candidates={rankedCandidates} />
      </div>
    </AppLayout>
  )
}

export default DashboardPage