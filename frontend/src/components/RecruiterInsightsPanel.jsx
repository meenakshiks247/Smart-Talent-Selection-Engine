import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

function RecruiterInsightsPanel({ insights, hasCandidates = false, isAnalyzing = false, onDownloadReport }) {
  const summaryCards = [
    {
      title: 'Top matching skill',
      helper: 'Most aligned with JD',
      value: insights?.topMatchingSkill?.label ?? 'N/A',
      subvalue: `${insights?.topMatchingSkill?.value ?? 0} candidate matches`,
    },
    {
      title: 'Most common missing skill',
      helper: 'Largest talent gap',
      value: insights?.mostCommonMissingSkill?.label ?? 'N/A',
      subvalue: `${insights?.mostCommonMissingSkill?.value ?? 0} candidates missing`,
    },
    {
      title: 'Average experience years',
      helper: 'Across ranked candidates',
      value: `${Number(insights?.averageExperienceYears ?? 0).toFixed(1)} yrs`,
      subvalue: 'Calculated from profile data',
    },
    {
      title: 'Shortlist count',
      helper: 'Manually selected',
      value: String(insights?.shortlistCount ?? 0),
      subvalue: 'Demo-ready hiring shortlist',
    },
  ]

  const hasSkillData = Array.isArray(insights?.jdSkills) && insights.jdSkills.length > 0

  return (
    <section className="rounded-3xl border border-slate-200/80 bg-white/95 p-6 shadow-sm shadow-slate-900/5 sm:p-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Recruiter Insights</p>
          <h2 className="mt-1 text-xl font-semibold text-slate-900">Analytics & Skill Gap Analysis</h2>
          <p className="mt-1 text-sm text-slate-600">
            A concise summary of skill fit, talent gaps, and shortlist readiness for demo storytelling.
          </p>
        </div>

        <button
          type="button"
          onClick={onDownloadReport}
          disabled={!hasCandidates || isAnalyzing}
          className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-55"
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M12 4v10" strokeLinecap="round" />
            <path d="M8.5 10.5 12 14l3.5-3.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M5 18.5h14" strokeLinecap="round" />
          </svg>
          Download Report (CSV)
        </button>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {summaryCards.map((card) => (
          <article key={card.title} className="rounded-2xl border border-slate-200 bg-slate-50/75 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-500">{card.title}</p>
            <p className="mt-3 text-xl font-bold text-slate-900">{card.value}</p>
            <p className="mt-1 text-xs text-slate-500">{card.helper}</p>
            <p className="mt-2 text-sm text-slate-600">{card.subvalue}</p>
          </article>
        ))}
      </div>

      <div className="mt-7 grid gap-5 xl:grid-cols-[1.25fr_1fr]">
        <article className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5">
          <div className="flex items-end justify-between">
            <div>
              <h3 className="text-base font-semibold text-slate-900">Skill Match vs Skill Gap</h3>
              <p className="mt-1 text-sm text-slate-600">Compares required JD skills against candidate profiles.</p>
            </div>
          </div>

          {hasCandidates && hasSkillData ? (
            <div className="mt-5 h-72 w-full">
              <ResponsiveContainer>
                <BarChart data={insights.chartData} margin={{ top: 8, right: 10, left: -16, bottom: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="skill" tick={{ fill: '#475569', fontSize: 11 }} />
                  <YAxis tick={{ fill: '#64748b', fontSize: 11 }} allowDecimals={false} />
                  <Tooltip
                    contentStyle={{
                      borderRadius: '12px',
                      borderColor: '#e2e8f0',
                      boxShadow: '0 10px 20px rgba(15, 23, 42, 0.08)',
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: '12px' }} />
                  <Bar dataKey="matched" name="Matched" fill="#0ea5e9" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="missing" name="Missing" fill="#fb7185" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="mt-5 rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-6 text-sm text-slate-600">
              Run candidate analysis to populate this skill chart.
            </div>
          )}
        </article>

        <article className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5">
          <h3 className="text-base font-semibold text-slate-900">Skill Gap Analysis</h3>
          <p className="mt-1 text-sm text-slate-600">Highlights matched and missing skills across the current talent pool.</p>

          {hasCandidates && hasSkillData ? (
            <>
              <div className="mt-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Matched JD skills</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {insights.matchedSkills.length > 0 ? (
                    insights.matchedSkills.map((skill) => (
                      <span
                        key={`matched-${skill}`}
                        className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800 ring-1 ring-emerald-200"
                      >
                        {skill}
                      </span>
                    ))
                  ) : (
                    <span className="text-sm text-slate-500">No matched skills detected.</span>
                  )}
                </div>
              </div>

              <div className="mt-5">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Most missing skills</p>
                <div className="mt-2 space-y-2">
                  {insights.missingSkillsRanked.slice(0, 5).map((item) => (
                    <div
                      key={`missing-${item.skill}`}
                      className="flex items-center justify-between rounded-xl bg-rose-50 px-3 py-2 ring-1 ring-rose-100"
                    >
                      <span className="text-sm font-medium text-rose-900">{item.skill}</span>
                      <span className="rounded-full bg-white px-2 py-0.5 text-xs font-semibold text-rose-700 ring-1 ring-rose-200">
                        {item.count} missing
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div className="mt-4 rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-6 text-sm text-slate-600">
              Skill gap insights will appear after ranking results are available.
            </div>
          )}
        </article>
      </div>
    </section>
  )
}

export default RecruiterInsightsPanel
