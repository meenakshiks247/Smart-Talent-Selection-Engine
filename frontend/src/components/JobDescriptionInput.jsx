function JobDescriptionInput({ value = '', onChange }) {

  return (
    <div className="mt-4 space-y-2">
      <label htmlFor="jobDescriptionInput" className="mb-2 block text-sm font-medium text-slate-700">
        Job Description
      </label>
      <textarea
        id="jobDescriptionInput"
        rows={10}
        value={value}
        onChange={onChange}
        placeholder="Paste the job description here..."
        className="min-h-64 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm leading-6 text-slate-700 shadow-sm transition placeholder:text-slate-400 focus:border-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-200"
      />
      <p className="text-right text-xs font-medium text-slate-500">Character count: {value.length}</p>
    </div>
  )
}


export default JobDescriptionInput