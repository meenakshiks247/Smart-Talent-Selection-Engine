import { formatScore } from '../utils/formatScore'

function RankingResultsSection({ candidates }) {
  if (!candidates.length) {
    return (
      <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-medium text-slate-900">Candidate Ranking Results</h2>
        <p className="mt-1 text-sm text-slate-600">Ranked output appears here after candidate analysis.</p>
        <p className="mt-4 rounded-md bg-slate-50 p-4 text-sm text-slate-600">
          Upload resumes and add a job description, then click Analyze Candidates to preview ranking results.
        </p>
      </section>
    )
  }

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-lg font-medium text-slate-900">Candidate Ranking Results</h2>
      <p className="mt-1 text-sm text-slate-600">Ranked output appears here after candidate analysis.</p>

      <div className="mt-4 space-y-3">
        {candidates.map((candidate, index) => (
          <article key={candidate.name} className="rounded-md border border-slate-200 p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="text-base font-semibold text-slate-900">
                {index + 1}. {candidate.name}
              </h3>
              <span className="rounded-full bg-slate-900 px-3 py-1 text-sm font-medium text-white">
                {formatScore(candidate.score)}
              </span>
            </div>
            <p className="mt-2 text-sm text-slate-600">{candidate.fit_summary}</p>
          </article>
        ))}
      </div>
    </section>
  )
}

export default RankingResultsSection