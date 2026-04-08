function CandidateResults({ candidates = [] }) {
  const sortedCandidates = [...candidates].sort((firstCandidate, secondCandidate) => {
    const firstScore = Number(firstCandidate?.score ?? 0)
    const secondScore = Number(secondCandidate?.score ?? 0)
    return secondScore - firstScore
  })

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

  if (sortedCandidates.length === 0) {
    return (
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Candidate Results</h2>
            <p className="mt-1 text-sm text-slate-600">
              Ranked candidates will appear here after the analysis step.
            </p>
          </div>
        </div>

        <div className="mt-4 rounded-xl border border-dashed border-slate-300 bg-slate-50 p-4 text-sm text-slate-600">
          Upload resumes, add a job description, and run analysis to preview the ranked candidate cards.
        </div>
      </section>
    )
  }

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Candidate Results</h2>
          <p className="mt-1 text-sm text-slate-600">
            Candidates are sorted by score in descending order for quick review.
          </p>
        </div>
        <p className="text-sm font-medium text-slate-500">{sortedCandidates.length} candidates</p>
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {sortedCandidates.map((candidate, index) => {
          const score = Number(candidate?.score ?? 0)
          const normalizedScore = Number.isNaN(score) ? 0 : Math.max(0, Math.min(score, 100))
          const scoreDisplay = `${Math.round(normalizedScore)}%`
          const scoreTone = getScoreTone(normalizedScore)
          const skillMatch = candidate?.skill_match ?? candidate?.skillMatch ?? 'Not provided'
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
                      <span className="rounded-full bg-emerald-600 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-white">
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
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Skill Match</p>
                  <p className="mt-1 text-sm font-medium text-slate-900">{skillMatch}</p>
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