import { useState } from 'react'
import AppLayout from './components/AppLayout'
import CandidateResults from './components/CandidateResults'
import JobDescriptionSection from './components/JobDescriptionSection'
import ResumeUploadSection from './components/ResumeUploadSection'
import { rankCandidates, uploadResumes } from './services/apiClient'
import { sampleJobDescription, sampleRankedCandidates } from './utils/mockData'

const USE_MOCK_DATA = import.meta.env.DEV && import.meta.env.VITE_USE_MOCK_DATA !== 'false'

function App() {
  const [jobDescription, setJobDescription] = useState(sampleJobDescription)
  const [selectedResumes, setSelectedResumes] = useState([])
  const [rankedCandidates, setRankedCandidates] = useState(USE_MOCK_DATA ? sampleRankedCandidates : [])
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [analysisStatus, setAnalysisStatus] = useState(USE_MOCK_DATA ? 'success' : 'idle')

  function normalizeRankedCandidate(candidate, index) {
    return {
      ...candidate,
      skill_match:
        candidate?.skill_match ??
        candidate?.skillMatch ??
        candidate?.score_breakdown?.matched_skills?.join(', ') ??
        candidate?.skills?.join(', ') ??
        'Not provided',
      experience:
        candidate?.experience ??
        (candidate?.experience_years !== undefined && candidate?.experience_years !== null
          ? `${candidate.experience_years} year${Number(candidate.experience_years) === 1 ? '' : 's'}`
          : 'Not provided'),
      fit_summary: candidate?.fit_summary ?? candidate?.fitSummary ?? 'No summary available.',
      score: Number(candidate?.score ?? 0),
      rank: index + 1,
    }
  }

  async function handleAnalyzeCandidates() {
    if (USE_MOCK_DATA) {
      setIsAnalyzing(true)
      setErrorMessage('')
      setAnalysisStatus('loading')
      setRankedCandidates([])

      await new Promise((resolve) => {
        window.setTimeout(resolve, 450)
      })

      setRankedCandidates(sampleRankedCandidates)
      setAnalysisStatus('success')
      setIsAnalyzing(false)
      return
    }

    if (selectedResumes.length === 0) {
      setErrorMessage('Please upload at least one resume before analyzing candidates.')
      setRankedCandidates([])
      setAnalysisStatus('error')
      return
    }

    if (!jobDescription.trim()) {
      setErrorMessage('Please enter a job description before analyzing candidates.')
      setRankedCandidates([])
      setAnalysisStatus('error')
      return
    }

    setIsAnalyzing(true)
    setErrorMessage('')
    setAnalysisStatus('loading')
    setRankedCandidates([])

    try {
      const uploadResponse = await uploadResumes(selectedResumes)
      const candidates = (uploadResponse?.files ?? []).map((fileEntry) => ({
        name: fileEntry?.name ?? fileEntry?.original_filename ?? 'Unnamed Candidate',
        skills: Array.isArray(fileEntry?.skills) ? fileEntry.skills : [],
        experience_years: fileEntry?.experience_years ?? 0,
        projects: Array.isArray(fileEntry?.projects) ? fileEntry.projects : [],
        extracted_text: fileEntry?.preview_text ?? '',
      }))

      const rankedResponse = await rankCandidates({
        jd_text: jobDescription,
        candidates,
      })

      const rankedList = Array.isArray(rankedResponse?.ranked_candidates)
        ? rankedResponse.ranked_candidates.map(normalizeRankedCandidate)
        : []

      setRankedCandidates(rankedList)
      setAnalysisStatus('success')
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Failed to analyze candidates.')
      setRankedCandidates([])
      setAnalysisStatus('error')
    } finally {
      setIsAnalyzing(false)
    }
  }

  const canAnalyze = USE_MOCK_DATA
    ? !isAnalyzing
    : selectedResumes.length > 0 && jobDescription.trim().length > 0 && !isAnalyzing

  return (
    <AppLayout>
      <div className="grid gap-6 lg:grid-cols-2">
        <ResumeUploadSection files={selectedResumes} onFilesChange={setSelectedResumes} />
        <JobDescriptionSection value={jobDescription} onChange={(event) => setJobDescription(event.target.value)} />
      </div>

      <div className="mt-8 flex justify-center">
        <button
          type="button"
          onClick={handleAnalyzeCandidates}
          disabled={!canAnalyze}
          aria-busy={isAnalyzing}
          className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
        >
          {isAnalyzing ? (
            <span
              className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"
              aria-hidden="true"
            />
          ) : null}
          {isAnalyzing ? 'Analyzing...' : 'Analyze Candidates'}
        </button>
      </div>

      <div className="mt-8">
        <CandidateResults
          candidates={rankedCandidates}
          status={analysisStatus}
          errorMessage={errorMessage}
          dataMode={USE_MOCK_DATA ? 'mock' : 'live'}
        />
      </div>
    </AppLayout>
  )
}

export default App