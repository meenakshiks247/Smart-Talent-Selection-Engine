function CandidateComparisonPanel({ candidates = [], comparedCount = 0, onClearComparison }) {
  const readyToCompare = candidates.length >= 2

  if (!readyToCompare) {
    return (
      <section className="rounded-3xl border border-slate-200/80 bg-white/95 p-6 shadow-sm shadow-slate-900/5 sm:p-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Candidate Comparison</p>
            <h2 className="mt-1 text-xl font-semibold text-slate-900">Side-by-Side Evaluation</h2>
            <p className="mt-1 text-sm text-slate-600">
              Select 2 or 3 candidates from the ranked list to compare strengths, gaps, and fit in one view.
            </p>
          </div>
          <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700 ring-1 ring-slate-200">
            {comparedCount}/3 selected
          </span>
        </div>

        <div className="mt-6 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-5 text-sm text-slate-600">
          Select at least 2 candidates to unlock the comparison workspace.
        </div>
      </section>
    )
  }

  const highestScore = Math.max(...candidates.map((candidate) => Number(candidate?.score ?? 0)), 0)

  return (
    <section className="rounded-3xl border border-slate-200/80 bg-white/95 p-6 shadow-sm shadow-slate-900/5 sm:p-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Candidate Comparison</p>
          <h2 className="mt-1 text-xl font-semibold text-slate-900">Side-by-Side Evaluation</h2>
          <p className="mt-1 text-sm text-slate-600">
            Compare key recruiting signals to explain your shortlist decision in a live demo.
          </p>
        </div>

        <button
          type="button"
          onClick={onClearComparison}
          className="inline-flex items-center justify-center rounded-2xl border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
        >
          Clear comparison
        </button>
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {candidates.map((candidate) => {
          const score = Math.round(Number(candidate?.score ?? 0))
          const scoreRatio = highestScore > 0 ? Math.max(8, Math.round((score / highestScore) * 100)) : 8

          return (
            <article key={candidate?.candidate_id ?? candidate?.name} className="rounded-2xl border border-slate-200 bg-slate-50/75 p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-slate-900">{candidate?.name ?? 'Unnamed Candidate'}</p>
                  <p className="mt-1 text-xs font-medium text-slate-500">Rank #{candidate?.rank ?? '-'}</p>
                </div>
                <span className="rounded-full bg-slate-900 px-2.5 py-1 text-xs font-semibold text-white">{score}%</span>
              </div>

              <div className="mt-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Score</p>
                <div className="mt-2 h-2 w-full rounded-full bg-slate-200">
                  <div className="h-2 rounded-full bg-sky-500" style={{ width: `${scoreRatio}%` }} />
                </div>
              </div>

              <div className="mt-4 grid gap-3 text-sm">
                <ComparisonBlock title="Skills" value={candidate.candidateSkills.join(', ') || 'Not provided'} />
                <ComparisonBlock title="Experience" value={candidate?.experience ?? 'Not provided'} />
                <ComparisonChips title="Matching Keywords" items={candidate.matchingKeywords} tone="sky" />
                <ComparisonBlock title="Fit Summary" value={candidate?.fit_summary ?? 'No summary available.'} />

                <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3">
                  <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">Strengths</p>
                  <ul className="mt-2 space-y-1 text-sm text-emerald-900">
                    {candidate.strengths.map((strength) => (
                      <li key={`${candidate?.candidate_id}-strength-${strength}`}>• {strength}</li>
                    ))}
                  </ul>
                </div>

                <div className="rounded-xl border border-rose-200 bg-rose-50 p-3">
                  <p className="text-xs font-semibold uppercase tracking-wide text-rose-700">Gaps</p>
                  <ul className="mt-2 space-y-1 text-sm text-rose-900">
                    {candidate.gaps.map((gap) => (
                      <li key={`${candidate?.candidate_id}-gap-${gap}`}>• {gap}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </article>
          )
        })}
      </div>
    </section>
  )
}

function ComparisonBlock({ title, value }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-3">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{title}</p>
      <p className="mt-1 text-sm leading-6 text-slate-700">{value}</p>
    </div>
  )
}

function ComparisonChips({ title, items = [], tone = 'sky' }) {
  const chipTone =
    tone === 'sky'
      ? 'bg-sky-100 text-sky-800 ring-sky-200'
      : 'bg-slate-100 text-slate-800 ring-slate-200'

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-3">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{title}</p>
      <div className="mt-2 flex flex-wrap gap-2">
        {items.length > 0 ? (
          items.map((item) => (
            <span key={`${title}-${item}`} className={`rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${chipTone}`}>
              {item}
            </span>
          ))
        ) : (
          <span className="text-sm text-slate-500">No matching keywords detected.</span>
        )}
      </div>
    </div>
  )
}

export default CandidateComparisonPanel
