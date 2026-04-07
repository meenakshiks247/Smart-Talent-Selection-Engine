import JobDescriptionInput from './JobDescriptionInput'


function JobDescriptionSection({ value, onChange }) {
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-lg font-medium text-slate-900">Job Description</h2>
      <p className="mt-1 text-sm text-slate-600">Paste the job description to rank candidates against it.</p>

      <JobDescriptionInput
        initialValue={value}
        onValueChange={(nextValue) => onChange({ target: { value: nextValue } })}
      />
    </section>
  )
}

export default JobDescriptionSection