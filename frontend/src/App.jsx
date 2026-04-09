import { useState } from 'react'
import AppLayout from './components/AppLayout'
import CandidateComparisonPanel from './components/CandidateComparisonPanel'
import CandidateResults from './components/CandidateResults'
import JobDescriptionSection from './components/JobDescriptionSection'
import RecruiterInsightsPanel from './components/RecruiterInsightsPanel'
import ResumeUploadSection from './components/ResumeUploadSection'
import { rankCandidates, uploadResumes } from './services/apiClient'
import { sampleJobDescription, sampleRankedCandidates } from './utils/mockData'

const USE_MOCK_DATA = import.meta.env.VITE_USE_MOCK_DATA === 'true'
const TOP_SHORTLIST_COUNT = 3
const SKILL_CATALOG = [
  'Python',
  'Java',
  'JavaScript',
  'TypeScript',
  'React',
  'Node.js',
  'FastAPI',
  'Django',
  'Flask',
  'SQL',
  'PostgreSQL',
  'MySQL',
  'MongoDB',
  'Docker',
  'Kubernetes',
  'AWS',
  'Azure',
  'GCP',
  'Machine Learning',
  'NLP',
  'Data Analysis',
  'Power BI',
  'Tableau',
  'Git',
  'CI/CD',
]

function normalizeSkillName(skill) {
  return String(skill ?? '')
    .trim()
    .replace(/\s+/g, ' ')
}

function extractSkillsFromText(text) {
  const normalizedText = String(text ?? '').toLowerCase()

  return SKILL_CATALOG.filter((skill) => {
    const escaped = skill
      .toLowerCase()
      .replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
      .replace(/\s+/g, '\\s+')
      .replace(/\.js/g, '(?:\\.js|js)')
    const pattern = new RegExp(`\\b${escaped}\\b`, 'i')
    return pattern.test(normalizedText)
  })
}

function collectCandidateSkills(candidate) {
  const normalizedSkills = []

  if (Array.isArray(candidate?.skills)) {
    normalizedSkills.push(...candidate.skills)
  }

  if (typeof candidate?.skill_match === 'string') {
    normalizedSkills.push(...candidate.skill_match.split(','))
  }

  if (typeof candidate?.skillMatch === 'string') {
    normalizedSkills.push(...candidate.skillMatch.split(','))
  }

  return Array.from(
    new Set(
      normalizedSkills
        .map((skill) => normalizeSkillName(skill))
        .filter((skill) => skill.length > 0),
    ),
  )
}

function getExperienceYears(candidate) {
  if (Number.isFinite(Number(candidate?.experience_years))) {
    return Number(candidate.experience_years)
  }

  if (typeof candidate?.experience === 'string') {
    const matched = candidate.experience.match(/\d+(?:\.\d+)?/)
    if (matched) {
      return Number(matched[0])
    }
  }

  return 0
}

function buildRecruiterInsights(jobDescription, candidates, shortlistedCandidateIds) {
  const jdSkills = extractSkillsFromText(jobDescription)
  const normalizedCandidates = candidates.map((candidate) => {
    const skillSet = new Set(collectCandidateSkills(candidate).map((skill) => skill.toLowerCase()))
    return {
      ...candidate,
      skillSet,
      experienceYears: getExperienceYears(candidate),
    }
  })

  const matchedSkillCounts = Object.fromEntries(jdSkills.map((skill) => [skill, 0]))
  const missingSkillCounts = Object.fromEntries(jdSkills.map((skill) => [skill, 0]))

  normalizedCandidates.forEach((candidate) => {
    jdSkills.forEach((skill) => {
      const lowerSkill = skill.toLowerCase()
      if (candidate.skillSet.has(lowerSkill)) {
        matchedSkillCounts[skill] += 1
      } else {
        missingSkillCounts[skill] += 1
      }
    })
  })

  const topMatchingSkill = Object.entries(matchedSkillCounts).sort((a, b) => b[1] - a[1])[0] ?? ['N/A', 0]
  const mostCommonMissingSkill = Object.entries(missingSkillCounts).sort((a, b) => b[1] - a[1])[0] ?? ['N/A', 0]

  const totalExperience = normalizedCandidates.reduce((sum, candidate) => sum + candidate.experienceYears, 0)
  const averageExperienceYears =
    normalizedCandidates.length > 0 ? totalExperience / normalizedCandidates.length : 0

  const chartData = jdSkills.slice(0, 8).map((skill) => ({
    skill,
    matched: matchedSkillCounts[skill],
    missing: missingSkillCounts[skill],
  }))

  const missingSkillsRanked = Object.entries(missingSkillCounts)
    .filter(([, count]) => count > 0)
    .sort((a, b) => b[1] - a[1])
    .map(([skill, count]) => ({
      skill,
      count,
    }))

  const matchedSkills = jdSkills.filter((skill) => matchedSkillCounts[skill] > 0)
  const missingSkills = jdSkills.filter((skill) => missingSkillCounts[skill] > 0)

  return {
    jdSkills,
    chartData,
    matchedSkills,
    missingSkills,
    missingSkillsRanked,
    topMatchingSkill: {
      label: topMatchingSkill[0],
      value: topMatchingSkill[1],
    },
    mostCommonMissingSkill: {
      label: mostCommonMissingSkill[0],
      value: mostCommonMissingSkill[1],
    },
    averageExperienceYears,
    shortlistCount: shortlistedCandidateIds.size,
  }
}

function App() {
  function normalizeRankedCandidate(candidate, index) {
    const normalizedName = candidate?.name ?? `Candidate ${index + 1}`

    return {
      ...candidate,
      candidate_id: candidate?.candidate_id ?? `${normalizedName}-${index + 1}`,
      name: normalizedName,
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

  const [jobDescription, setJobDescription] = useState(sampleJobDescription)
  const [selectedResumes, setSelectedResumes] = useState([])
  const [rankedCandidates, setRankedCandidates] = useState(
    USE_MOCK_DATA ? sampleRankedCandidates.map(normalizeRankedCandidate) : [],
  )
  const [shortlistedCandidateIds, setShortlistedCandidateIds] = useState(new Set())
  const [comparedCandidateIds, setComparedCandidateIds] = useState(new Set())
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [analysisStatus, setAnalysisStatus] = useState(USE_MOCK_DATA ? 'success' : 'idle')
  const [analysisSummary, setAnalysisSummary] = useState(null)

  async function handleAnalyzeCandidates() {
    if (USE_MOCK_DATA) {
      setIsAnalyzing(true)
      setErrorMessage('')
      setAnalysisStatus('loading')
      setRankedCandidates([])
      setAnalysisSummary(null)

      await new Promise((resolve) => {
        window.setTimeout(resolve, 450)
      })

      const mockRankedCandidates = sampleRankedCandidates.map(normalizeRankedCandidate)

      setRankedCandidates(mockRankedCandidates)
      setShortlistedCandidateIds(new Set())
      setComparedCandidateIds(new Set())
      setAnalysisSummary({
        uploadedCount: mockRankedCandidates.length,
        extractedCount: mockRankedCandidates.length,
        rankedCount: mockRankedCandidates.length,
        skippedCount: 0,
      })
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
    setAnalysisSummary(null)

    try {
      const uploadResponse = await uploadResumes(selectedResumes)
      const uploadedFiles = Array.isArray(uploadResponse?.files) ? uploadResponse.files : []

      if (uploadedFiles.length === 0) {
        throw new Error('No candidate profiles were extracted from uploaded resumes.')
      }

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
      const skippedCandidates = Array.isArray(rankedResponse?.skipped_candidates)
        ? rankedResponse.skipped_candidates
        : []

      setRankedCandidates(rankedList)
      setShortlistedCandidateIds(new Set())
      setComparedCandidateIds(new Set())
      setAnalysisSummary({
        uploadedCount: uploadResponse?.total_files ?? uploadedFiles.length,
        extractedCount: uploadResponse?.successful_extractions ?? uploadedFiles.length,
        rankedCount: rankedList.length,
        skippedCount: skippedCandidates.length,
      })
      setAnalysisStatus('success')
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Failed to analyze candidates.')
      setRankedCandidates([])
      setShortlistedCandidateIds(new Set())
      setComparedCandidateIds(new Set())
      setAnalysisSummary(null)
      setAnalysisStatus('error')
    } finally {
      setIsAnalyzing(false)
    }
  }

  const canAnalyze = USE_MOCK_DATA
    ? !isAnalyzing
    : selectedResumes.length > 0 && jobDescription.trim().length > 0 && !isAnalyzing

  const validScores = rankedCandidates
    .map((candidate) => Number(candidate?.score ?? 0))
    .filter((score) => Number.isFinite(score))

  const bestMatchScore = validScores.length > 0 ? Math.max(...validScores) : 0
  const averageMatchScore =
    validScores.length > 0
      ? validScores.reduce((total, score) => total + score, 0) / validScores.length
      : 0

  const insights = buildRecruiterInsights(jobDescription, rankedCandidates, shortlistedCandidateIds)

  const comparisonCandidates = [...rankedCandidates]
    .sort((a, b) => Number(b?.score ?? 0) - Number(a?.score ?? 0))
    .filter((candidate) => comparedCandidateIds.has(candidate?.candidate_id))
    .map((candidate) => {
      const candidateSkills = collectCandidateSkills(candidate)
      const candidateSkillSet = new Set(candidateSkills.map((skill) => skill.toLowerCase()))
      const matchingKeywords = insights.jdSkills.filter((skill) => candidateSkillSet.has(skill.toLowerCase()))
      const missingKeywords = insights.jdSkills.filter((skill) => !candidateSkillSet.has(skill.toLowerCase()))
      const experienceYears = getExperienceYears(candidate)
      const score = Number(candidate?.score ?? 0)
      const strengths = []

      if (score >= 80) {
        strengths.push('Excellent semantic score')
      }

      if (experienceYears >= 4) {
        strengths.push('Strong experience depth')
      }

      if (matchingKeywords.length > 0) {
        strengths.push(`Matches ${matchingKeywords.slice(0, 2).join(' and ')}`)
      }

      if (strengths.length === 0) {
        strengths.push('General role alignment detected')
      }

      const gaps = missingKeywords.length > 0 ? missingKeywords.slice(0, 4) : ['No major gaps detected']

      return {
        ...candidate,
        candidateSkills,
        matchingKeywords,
        missingKeywords,
        strengths,
        gaps,
      }
    })

  function toggleShortlist(candidateId) {
    setShortlistedCandidateIds((previousShortlisted) => {
      const nextShortlisted = new Set(previousShortlisted)

      if (nextShortlisted.has(candidateId)) {
        nextShortlisted.delete(candidateId)
      } else {
        nextShortlisted.add(candidateId)
      }

      return nextShortlisted
    })
  }

  function toggleCompareCandidate(candidateId) {
    setComparedCandidateIds((previousCompared) => {
      const nextCompared = new Set(previousCompared)

      if (nextCompared.has(candidateId)) {
        nextCompared.delete(candidateId)
        return nextCompared
      }

      if (nextCompared.size >= 3) {
        return nextCompared
      }

      nextCompared.add(candidateId)
      return nextCompared
    })
  }

  function clearComparedCandidates() {
    setComparedCandidateIds(new Set())
  }

  function handleDownloadReport() {
    if (rankedCandidates.length === 0) {
      return
    }

    const header = [
      'Rank',
      'Candidate Name',
      'Score',
      'Experience',
      'Skills',
      'Fit Summary',
      'Shortlisted',
      'JD Skills',
      'Missing Skills',
    ]

    const missingSkills = insights.missingSkills.join('; ')
    const jdSkills = insights.jdSkills.join('; ')

    const rows = rankedCandidates
      .slice()
      .sort((a, b) => Number(b?.score ?? 0) - Number(a?.score ?? 0))
      .map((candidate, index) => {
        const candidateSkills = collectCandidateSkills(candidate).join('; ')
        const row = [
          index + 1,
          candidate?.name ?? 'Unnamed Candidate',
          Math.round(Number(candidate?.score ?? 0)),
          candidate?.experience ?? 'Not provided',
          candidateSkills || candidate?.skill_match || 'Not provided',
          candidate?.fit_summary ?? 'No summary available.',
          shortlistedCandidateIds.has(candidate?.candidate_id) ? 'Yes' : 'No',
          jdSkills || 'N/A',
          missingSkills || 'None',
        ]

        return row.map((value) => `"${String(value).replaceAll('"', '""')}"`).join(',')
      })

    const csvOutput = [header.join(','), ...rows].join('\n')
    const csvBlob = new Blob([csvOutput], { type: 'text/csv;charset=utf-8;' })
    const downloadUrl = URL.createObjectURL(csvBlob)
    const linkElement = document.createElement('a')
    const reportDate = new Date().toISOString().slice(0, 10)

    linkElement.href = downloadUrl
    linkElement.download = `recruiter-insights-report-${reportDate}.csv`
    document.body.appendChild(linkElement)
    linkElement.click()
    linkElement.remove()
    URL.revokeObjectURL(downloadUrl)
  }

  const kpiItems = [
    {
      title: 'Total resumes uploaded',
      helper: 'Current selection',
      value: String(selectedResumes.length),
    },
    {
      title: 'Candidates analyzed',
      helper: 'Latest analysis run',
      value: String(rankedCandidates.length),
    },
    {
      title: 'Best match score',
      helper: 'Top candidate',
      value: `${Math.round(bestMatchScore)}%`,
    },
    {
      title: 'Average match score',
      helper: 'Across ranked candidates',
      value: `${Math.round(averageMatchScore)}%`,
    },
  ]

  return (
    <AppLayout
      kpiItems={kpiItems}
      analysisStatus={analysisStatus}
      isAnalyzing={isAnalyzing}
      dataMode={USE_MOCK_DATA ? 'mock' : 'live'}
    >
      <section className="grid gap-6 xl:grid-cols-2">
        <ResumeUploadSection files={selectedResumes} onFilesChange={setSelectedResumes} isAnalyzing={isAnalyzing} />
        <JobDescriptionSection
          value={jobDescription}
          isAnalyzing={isAnalyzing}
          onChange={(event) => setJobDescription(event.target.value)}
        />
      </section>

      <section className="mt-8 rounded-3xl border border-slate-200/80 bg-white/90 p-6 shadow-sm shadow-slate-900/5 backdrop-blur sm:p-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Run Candidate Analysis</h2>
            <p className="mt-1 text-sm text-slate-600">
              Process uploaded resumes against the job description and generate ranked matches.
            </p>
          </div>

          <button
            type="button"
            onClick={handleAnalyzeCandidates}
            disabled={!canAnalyze}
            aria-busy={isAnalyzing}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
          >
            {isAnalyzing ? (
              <span
                className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"
                aria-hidden="true"
              />
            ) : null}
            {isAnalyzing ? 'Analyzing candidates...' : 'Analyze Candidates'}
          </button>
        </div>

        {errorMessage && analysisStatus === 'error' ? (
          <div className="mt-5 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {errorMessage}
          </div>
        ) : null}

        {analysisStatus === 'success' && analysisSummary ? (
          <div className="mt-5 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
            Uploaded {analysisSummary.uploadedCount} resumes, extracted {analysisSummary.extractedCount} profiles,
            ranked {analysisSummary.rankedCount} candidates
            {analysisSummary.skippedCount > 0 ? `, skipped ${analysisSummary.skippedCount}.` : '.'}
          </div>
        ) : null}
      </section>

      <section className="mt-8">
        <RecruiterInsightsPanel
          insights={insights}
          hasCandidates={rankedCandidates.length > 0}
          isAnalyzing={isAnalyzing}
          onDownloadReport={handleDownloadReport}
        />
      </section>

      <section className="mt-8">
        <CandidateComparisonPanel
          candidates={comparisonCandidates}
          comparedCount={comparedCandidateIds.size}
          onClearComparison={clearComparedCandidates}
        />
      </section>

      <section className="mt-8">
        <CandidateResults
          candidates={rankedCandidates}
          status={analysisStatus}
          errorMessage={errorMessage}
          dataMode={USE_MOCK_DATA ? 'mock' : 'live'}
          shortlistedCandidateIds={shortlistedCandidateIds}
          onToggleShortlist={toggleShortlist}
          topShortlistCount={TOP_SHORTLIST_COUNT}
          comparedCandidateIds={comparedCandidateIds}
          onToggleCompareCandidate={toggleCompareCandidate}
        />
      </section>
    </AppLayout>
  )
}

export default App