import JobDescriptionInput from './JobDescriptionInput'


function JobDescriptionSection({ value, onChange, isAnalyzing = false }) {
  return (
    <section className="rounded-3xl border border-slate-200/80 bg-white/90 p-6 shadow-sm shadow-slate-900/5 sm:p-8">
      <div className="flex items-start gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-sky-50 text-sky-700 ring-1 ring-sky-100">
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M7 4h8l4 4v12a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1Z" />
            <path d="M15 4v4h4" />
            <path d="M9 12h6M9 16h5" strokeLinecap="round" />
          </svg>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Role context</p>
          <h2 className="mt-1 text-xl font-semibold text-slate-900">Job Description</h2>
          <p className="mt-1 text-sm text-slate-600">Provide hiring expectations and role details to drive accurate ranking.</p>
        </div>
      </div>

      <p className="mt-4 text-xs text-slate-500">Tip: include must-have skills, years of experience, and domain context.</p>

      <JobDescriptionInput
        value={value}
        isAnalyzing={isAnalyzing}
        onChange={onChange}
      />
    </section>
  )
}

export default JobDescriptionSection