function CandidateResults({
  candidates = [],
  status = 'idle',
  errorMessage = '',
  dataMode = 'live',
  shortlistedCandidateIds = new Set(),
  onToggleShortlist,
  topShortlistCount = 3,
  comparedCandidateIds = new Set(),
  onToggleCompareCandidate,
}) {
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
        badge: 'bg-emerald-100 text-emerald-800 ring-emerald-200',
      }
    }

    if (score >= 60) {
      return {
        label: 'Medium',
        track: 'bg-amber-100',
        fill: 'bg-amber-500',
        text: 'text-amber-700',
        badge: 'bg-amber-100 text-amber-800 ring-amber-200',
      }
    }

    return {
      label: 'Low',
      track: 'bg-rose-100',
      fill: 'bg-rose-500',
      text: 'text-rose-700',
      badge: 'bg-rose-100 text-rose-800 ring-rose-200',
    }
  }

  if (isLoading) {
    return (
      <section className="rounded-3xl border border-slate-200/80 bg-white/90 p-6 shadow-sm shadow-slate-900/5 sm:p-8">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">Candidate Ranking</h2>
            <p className="mt-1 text-sm text-slate-600">Analyzing profiles and building scorecards.</p>
          </div>
          <span className="inline-flex items-center gap-2 rounded-full bg-sky-50 px-3 py-1 text-xs font-semibold text-sky-700 ring-1 ring-sky-100">
            <span className="h-2 w-2 animate-pulse rounded-full bg-sky-500" />
            Processing
          </span>
        </div>

        <div className="mt-6 animate-pulse space-y-3">
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={`skeleton-row-${index}`} className="rounded-2xl bg-slate-100 p-4">
              <div className="h-5 w-20 rounded-md bg-slate-200" />
              <div className="mt-3 h-5 w-1/2 rounded-md bg-slate-200" />
              <div className="mt-3 h-4 w-5/6 rounded-md bg-slate-200" />
              <div className="mt-4 h-2 w-full rounded-full bg-slate-200" />
            </div>
          ))}
        </div>
      </section>
    )
  }

  if (isError) {
    return (
      <section className="rounded-3xl border border-rose-200 bg-white/95 p-6 shadow-sm shadow-rose-900/10 sm:p-8">
        <h2 className="text-xl font-semibold text-slate-900">Candidate Ranking</h2>
        <p className="mt-1 text-sm text-slate-600">Something interrupted the ranking process.</p>
        <div className="mt-5 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
          <p className="font-semibold">Analysis could not be completed.</p>
          <p className="mt-1">{errorMessage || 'Please try again with updated files and job context.'}</p>
        </div>
      </section>
    )
  }

  if (isIdle) {
    return (
      <section className="rounded-3xl border border-slate-200/80 bg-white/90 p-6 shadow-sm shadow-slate-900/5 sm:p-8">
        <h2 className="text-xl font-semibold text-slate-900">Candidate Ranking</h2>
        <p className="mt-1 text-sm text-slate-600">No ranking yet. Start an analysis to populate this section.</p>

        <div className="mt-6 rounded-2xl border border-dashed border-slate-300 bg-slate-50/90 p-6 text-sm text-slate-600">
          <div className="flex items-center gap-3 text-slate-800">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white ring-1 ring-slate-200">
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M7 3h7l5 5v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Z" />
                <path d="M14 3v5h5" />
                <path d="M9 13h6M9 17h6" strokeLinecap="round" />
              </svg>
            </span>
            <p className="font-semibold">Run your first screening cycle</p>
          </div>

          <ul className="mt-4 space-y-2 pl-1">
            <li>1. Upload resumes from your sourcing pipeline.</li>
            <li>2. Paste the role and hiring requirements.</li>
            <li>3. Launch analysis to generate ranked candidates.</li>
          </ul>
        </div>
      </section>
    )
  }

  if (!hasResults) {
    return (
      <section className="rounded-3xl border border-slate-200/80 bg-white/90 p-6 shadow-sm shadow-slate-900/5 sm:p-8">
        <h2 className="text-xl font-semibold text-slate-900">Candidate Ranking</h2>
        <p className="mt-1 text-sm text-slate-600">Analysis completed with no candidates available for ranking.</p>

        <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
          Refine extracted resume data or adjust the job description to improve matching.
        </div>
      </section>
    )
  }

  return (
    <section className="rounded-3xl border border-slate-200/80 bg-white/95 p-6 shadow-sm shadow-slate-900/5 sm:p-8">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">Candidate Ranking</h2>
          <p className="mt-1 text-sm text-slate-600">Sorted by semantic match score for faster shortlisting.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {dataMode === 'mock' ? (
            <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700 ring-1 ring-indigo-100">
              Development preview data
            </span>
          ) : null}
          <span className="rounded-full bg-sky-50 px-3 py-1 text-xs font-semibold text-sky-700 ring-1 ring-sky-100">
            Compare: {comparedCandidateIds.size}/3 selected
          </span>
          <p className="text-sm font-medium text-slate-500">{sortedCandidates.length} candidates</p>
        </div>
      </div>

      <div className="mt-6 hidden overflow-hidden rounded-2xl border border-slate-200 lg:block">
        <div className="grid grid-cols-[58px_1.2fr_1fr_1fr_170px] gap-4 border-b border-slate-200 bg-slate-50 px-5 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
          <p>Rank</p>
          <p>Candidate</p>
          <p>Skills</p>
          <p>Experience</p>
          <p>Score</p>
        </div>

        <div className="divide-y divide-slate-200 bg-white">
          {sortedCandidates.map((candidate, index) => {
            const score = Number(candidate?.score ?? 0)
            const normalizedScore = Number.isNaN(score) ? 0 : Math.max(0, Math.min(score, 100))
            const scoreTone = getScoreTone(normalizedScore)
            const skills = Array.isArray(candidate?.skills)
              ? candidate.skills.join(', ')
              : candidate?.skill_match ?? candidate?.skillMatch ?? 'Not provided'
            const experience = candidate?.experience ?? 'Not provided'
            const candidateId = candidate?.candidate_id ?? `${candidate?.name ?? 'candidate'}-${index + 1}`
            const canShortlist = index < topShortlistCount
            const isShortlisted = shortlistedCandidateIds.has(candidateId)
            const isCompared = comparedCandidateIds.has(candidateId)
            const disableCompareSelection = comparedCandidateIds.size >= 3 && !isCompared

            return (
              <div
                key={`${candidate?.name ?? 'candidate'}-table-${index}`}
                className={`grid grid-cols-[58px_1.2fr_1fr_1fr_170px] gap-4 px-5 py-4 text-sm ${
                  index === 0 ? 'bg-gradient-to-r from-emerald-50/70 via-emerald-50/35 to-white' : 'bg-white'
                }`}
              >
                <div>
                  <p className="font-semibold text-slate-700">#{index + 1}</p>
                  {index === 0 ? (
                    <span className="mt-1 inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-emerald-800 ring-1 ring-emerald-200">
                      <svg viewBox="0 0 20 20" className="h-3 w-3" fill="currentColor" aria-hidden="true">
                        <path d="M10 1.75l2.08 4.22 4.66.68-3.37 3.28.8 4.64L10 12.37 5.83 14.57l.8-4.64L3.26 6.65l4.66-.68L10 1.75z" />
                      </svg>
                      Best
                    </span>
                  ) : null}
                </div>

                <div>
                  <p className="font-semibold text-slate-900">{candidate?.name ?? 'Unnamed Candidate'}</p>
                  <p className="mt-1 line-clamp-2 text-xs leading-5 text-slate-500">
                    {candidate?.fit_summary ?? candidate?.fitSummary ?? 'No summary available.'}
                  </p>
                  {canShortlist ? (
                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        onClick={() => onToggleShortlist?.(candidateId)}
                        className={`inline-flex items-center gap-1 rounded-xl px-3 py-1.5 text-xs font-semibold transition ${
                          isShortlisted
                            ? 'bg-emerald-100 text-emerald-800 ring-1 ring-emerald-200 hover:bg-emerald-200'
                            : 'bg-slate-900 text-white hover:bg-slate-800'
                        }`}
                      >
                        {isShortlisted ? 'Shortlisted' : 'Shortlist Candidate'}
                      </button>

                      <button
                        type="button"
                        onClick={() => onToggleCompareCandidate?.(candidateId)}
                        disabled={disableCompareSelection}
                        className={`inline-flex items-center gap-1 rounded-xl px-3 py-1.5 text-xs font-semibold transition ${
                          isCompared
                            ? 'bg-sky-100 text-sky-800 ring-1 ring-sky-200 hover:bg-sky-200'
                            : 'bg-white text-slate-700 ring-1 ring-slate-300 hover:bg-slate-100'
                        } disabled:cursor-not-allowed disabled:opacity-50`}
                      >
                        {isCompared ? 'Compared' : 'Add to Compare'}
                      </button>
                    </div>
                  ) : null}
                </div>

                <p className="line-clamp-2 text-slate-600">{skills}</p>
                <p className="text-slate-600">{experience}</p>

                <div className="flex items-center justify-between gap-2">
                  <div className="w-full">
                    <div className="mb-2 flex items-center justify-between gap-2">
                      <p className="text-base font-bold text-slate-900">{Math.round(normalizedScore)}%</p>
                      <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${scoreTone.badge}`}>
                        {scoreTone.label}
                      </span>
                    </div>
                    <div className={`h-2 w-full overflow-hidden rounded-full ${scoreTone.track}`}>
                      <div
                        className={`h-full rounded-full ${scoreTone.fill}`}
                        style={{ width: `${normalizedScore}%` }}
                        aria-hidden="true"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <div className="mt-6 grid gap-4 lg:hidden">
        {sortedCandidates.map((candidate, index) => {
          const score = Number(candidate?.score ?? 0)
          const normalizedScore = Number.isNaN(score) ? 0 : Math.max(0, Math.min(score, 100))
          const scoreTone = getScoreTone(normalizedScore)
          const skills = Array.isArray(candidate?.skills)
            ? candidate.skills.join(', ')
            : candidate?.skill_match ?? candidate?.skillMatch ?? 'Not provided'
          const experience = candidate?.experience ?? 'Not provided'
          const fitSummary = candidate?.fit_summary ?? candidate?.fitSummary ?? 'No summary available.'
          const candidateId = candidate?.candidate_id ?? `${candidate?.name ?? 'candidate'}-${index + 1}`
          const canShortlist = index < topShortlistCount
          const isShortlisted = shortlistedCandidateIds.has(candidateId)
          const isCompared = comparedCandidateIds.has(candidateId)
          const disableCompareSelection = comparedCandidateIds.size >= 3 && !isCompared

          return (
            <article
              key={`${candidate?.name ?? 'candidate'}-${index}`}
              className={`rounded-2xl border bg-white p-4 shadow-sm shadow-slate-900/5 transition sm:p-5 ${
                index === 0 ? 'border-emerald-200 ring-1 ring-emerald-100' : 'border-slate-200/90'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-base font-semibold text-slate-900">
                      {candidate?.name ?? 'Unnamed Candidate'}
                    </h3>
                    {index === 0 ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-emerald-800 ring-1 ring-emerald-200">
                        <svg viewBox="0 0 20 20" className="h-3.5 w-3.5" fill="currentColor" aria-hidden="true">
                          <path d="M10 1.75l2.08 4.22 4.66.68-3.37 3.28.8 4.64L10 12.37 5.83 14.57l.8-4.64L3.26 6.65l4.66-.68L10 1.75z" />
                        </svg>
                        Best Fit
                      </span>
                    ) : null}
                  </div>
                  <p className="mt-1 text-sm text-slate-500">Rank #{index + 1}</p>
                </div>

                <div className="text-right">
                  <p className="text-lg font-bold text-slate-900">{Math.round(normalizedScore)}%</p>
                  <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${scoreTone.badge}`}>
                    {scoreTone.label} Score
                  </span>
                </div>
              </div>

              <div className="mt-4">
                <div className="mb-2 flex items-center justify-between gap-3">
                  <p className={`text-xs font-semibold uppercase tracking-wide ${scoreTone.text}`}>
                    {scoreTone.label} Match
                  </p>
                  <p className="text-xs font-semibold text-slate-500">{Math.round(normalizedScore)}% aligned</p>
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

              {canShortlist ? (
                <div className="mt-4 grid gap-2 sm:grid-cols-2">
                  <button
                    type="button"
                    onClick={() => onToggleShortlist?.(candidateId)}
                    className={`w-full rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
                      isShortlisted
                        ? 'bg-emerald-100 text-emerald-800 ring-1 ring-emerald-200 hover:bg-emerald-200'
                        : 'bg-slate-900 text-white hover:bg-slate-800'
                    }`}
                  >
                    {isShortlisted ? 'Shortlisted' : 'Shortlist Candidate'}
                  </button>

                  <button
                    type="button"
                    onClick={() => onToggleCompareCandidate?.(candidateId)}
                    disabled={disableCompareSelection}
                    className={`w-full rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
                      isCompared
                        ? 'bg-sky-100 text-sky-800 ring-1 ring-sky-200 hover:bg-sky-200'
                        : 'bg-white text-slate-700 ring-1 ring-slate-300 hover:bg-slate-100'
                    } disabled:cursor-not-allowed disabled:opacity-55`}
                  >
                    {isCompared ? 'Compared' : 'Add to Compare'}
                  </button>
                </div>
              ) : null}
            </article>
          )
        })}
      </div>
    </section>
  )
}

export default CandidateResults