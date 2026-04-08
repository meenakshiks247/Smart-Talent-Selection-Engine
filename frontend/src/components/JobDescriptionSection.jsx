import JobDescriptionInput from './JobDescriptionInput'


function JobDescriptionSection({ value, onChange }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/60">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-50 text-sky-700 ring-1 ring-sky-100">
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M7 4h8l4 4v12a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1Z" />
            <path d="M15 4v4h4" />
            <path d="M9 12h6M9 16h5" strokeLinecap="round" />
          </svg>
        </div>
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Job Description</h2>
          <p className="mt-1 text-sm text-slate-600">Paste the job description to rank candidates against it.</p>
        </div>
      </div>

      <JobDescriptionInput
        value={value}
        onChange={onChange}
      />
    </section>
  )
}

export default JobDescriptionSection