function CandidateResults({ candidates = [], status = 'idle', errorMessage = '', dataMode = 'live' }) {
  const sortedCandidates = [...candidates].sort((firstCandidate, secondCandidate) => {
    const firstScore = Number(firstCandidate?.score ?? 0)
    const secondScore = Number(secondCandidate?.score ?? 0)
    return secondScore - firstScore
  })

  const isIdle = status === 'idle'
  const isLoading = status === 'loading'
  const isError = status === 'error'
  const hasResults = sortedCandidates.length > 0

  function getScoreTone(score) {
    if (score >= 80) {
      return {
        label: 'High',
        track: 'bg-emerald-100',
        fill: 'bg-emerald-500',
        text: 'text-emerald-700',
        badge: 'bg-emerald-600 text-white',
      }
    }

    if (score >= 60) {
      return {
        label: 'Medium',
        track: 'bg-amber-100',
        fill: 'bg-amber-500',
        text: 'text-amber-700',
        badge: 'bg-amber-500 text-white',
      }
    }

    return {
      label: 'Low',
      track: 'bg-rose-100',
      fill: 'bg-rose-500',
      text: 'text-rose-700',
      badge: 'bg-rose-600 text-white',
    }
  }

  if (isLoading) {
    return (
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/60 sm:p-7">
        <h2 className="text-lg font-semibold text-slate-900">Candidate Results</h2>
        <p className="mt-1 text-sm text-slate-600">Analyzing resumes and job description match now.</p>

        <div className="mt-5 flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm">
          <span className="h-5 w-5 animate-spin rounded-full border-2 border-slate-900 border-t-transparent" />
          <div>
            <p className="text-sm font-medium text-slate-900">Ranking candidates...</p>
            <p className="text-sm text-slate-600">This may take a few seconds while the backend processes the files.</p>
          </div>
        </div>
      </section>
    )
  }

  if (isError) {
    return (
      <section className="rounded-2xl border border-rose-200 bg-white p-6 shadow-sm shadow-slate-200/60 sm:p-7">
        <h2 className="text-lg font-semibold text-slate-900">Candidate Results</h2>
        <div className="mt-5 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700 shadow-sm">
          <p className="font-semibold">Analysis could not be completed.</p>
          <p className="mt-1">{errorMessage || 'Please try again in a moment.'}</p>
        </div>
      </section>
    )
  }

  if (isIdle) {
    return (
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/60 sm:p-7">
        <h2 className="text-lg font-semibold text-slate-900">Candidate Results</h2>
        <p className="mt-1 text-sm text-slate-600">
          Your ranked candidates will appear here after the first analysis run.
        </p>

        <div className="mt-5 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-4 text-sm leading-6 text-slate-600 shadow-sm">
          <p className="font-medium text-slate-800">To get started:</p>
          <ul className="mt-2 space-y-1 pl-4">
            <li>Upload one or more resume files.</li>
            <li>Paste the job description you want to screen against.</li>
            <li>Click Analyze Candidates to generate the ranking.</li>
          </ul>
        </div>
      </section>
    )
  }

  if (!hasResults) {
    return (
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/60 sm:p-7">
        <h2 className="text-lg font-semibold text-slate-900">Candidate Results</h2>
        <p className="mt-1 text-sm text-slate-600">The analysis finished, but no candidates were returned.</p>

        <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600 shadow-sm">
          Try uploading resumes with clearer extracted profile data or run the analysis again.
        </div>
      </section>
    )
  }

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/60 sm:p-7">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Candidate Results</h2>
          <p className="mt-1 text-sm text-slate-600">
            Candidates are sorted by score in descending order for quick review.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {dataMode === 'mock' ? (
            <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700 ring-1 ring-indigo-100">
              Development preview data
            </span>
          ) : null}
          <p className="text-sm font-medium text-slate-500">{sortedCandidates.length} candidates</p>
        </div>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {sortedCandidates.map((candidate, index) => {
          const score = Number(candidate?.score ?? 0)
          const normalizedScore = Number.isNaN(score) ? 0 : Math.max(0, Math.min(score, 100))
          const scoreDisplay = `${Math.round(normalizedScore)}%`
          const scoreTone = getScoreTone(normalizedScore)
          const skills = Array.isArray(candidate?.skills)
            ? candidate.skills.join(', ')
            : candidate?.skill_match ?? candidate?.skillMatch ?? 'Not provided'
          const experience = candidate?.experience ?? 'Not provided'
          const fitSummary = candidate?.fit_summary ?? candidate?.fitSummary ?? 'No summary available.'

          return (
            <article
              key={`${candidate?.name ?? 'candidate'}-${index}`}
              className={`rounded-2xl border bg-slate-50 p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md sm:p-5 ${
                index === 0 ? 'border-emerald-200 ring-1 ring-emerald-100' : 'border-slate-200'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-base font-semibold text-slate-900">
                      {candidate?.name ?? 'Unnamed Candidate'}
                    </h3>
                    {index === 0 ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-600 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-white">
                        <svg viewBox="0 0 20 20" className="h-3.5 w-3.5" fill="currentColor" aria-hidden="true">
                          <path d="M10 1.75l2.08 4.22 4.66.68-3.37 3.28.8 4.64L10 12.37 5.83 14.57l.8-4.64L3.26 6.65l4.66-.68L10 1.75z" />
                        </svg>
                        Best Fit
                      </span>
                    ) : null}
                  </div>
                  <p className="mt-1 text-sm text-slate-500">Rank #{index + 1}</p>
                </div>

                <div className={`rounded-2xl px-3 py-2 text-right shadow-sm ${scoreTone.badge}`}>
                  <p className="text-[11px] font-medium uppercase tracking-wider opacity-85">Score</p>
                  <p className="text-lg font-bold">{scoreDisplay}</p>
                </div>
              </div>

              <div className="mt-4">
                <div className="mb-2 flex items-center justify-between gap-3">
                  <p className={`text-xs font-semibold uppercase tracking-wide ${scoreTone.text}`}>
                    {scoreTone.label} Match
                  </p>
                  <p className="text-xs font-semibold text-slate-500">{scoreDisplay} aligned</p>
                </div>
                <div className={`h-2 w-full overflow-hidden rounded-full ${scoreTone.track}`}>
                  <div
                    className={`h-full rounded-full ${scoreTone.fill}`}
                    style={{ width: `${normalizedScore}%` }}
                    aria-hidden="true"
                  />
                </div>
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <div className="rounded-xl bg-white px-3 py-3 ring-1 ring-slate-200">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Skills</p>
                  <p className="mt-1 text-sm font-medium text-slate-900">{skills}</p>
                </div>
                <div className="rounded-xl bg-white px-3 py-3 ring-1 ring-slate-200">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Experience</p>
                  <p className="mt-1 text-sm font-medium text-slate-900">{experience}</p>
                </div>
              </div>

              <div className="mt-4 rounded-xl border border-slate-200 bg-white p-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Fit Summary</p>
                <p className="mt-1 text-sm leading-6 text-slate-700">{fitSummary}</p>
              </div>
            </article>
          )
        })}
      </div>
    </section>
  )
}

export default CandidateResults