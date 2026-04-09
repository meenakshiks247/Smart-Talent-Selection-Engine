function JobDescriptionInput({ value = '', onChange, isAnalyzing = false }) {

  return (
    <div className="mt-5 space-y-2">
      <label htmlFor="jobDescriptionInput" className="mb-2 block text-sm font-semibold text-slate-700">
        Job Description
      </label>
      <textarea
        id="jobDescriptionInput"
        rows={10}
        value={value}
        onChange={onChange}
        disabled={isAnalyzing}
        placeholder="Paste the job description here..."
        className="min-h-64 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm leading-6 text-slate-700 shadow-inner shadow-slate-200/30 transition placeholder:text-slate-400 focus:border-sky-500 focus:outline-none focus:ring-4 focus:ring-sky-100 disabled:cursor-not-allowed disabled:bg-slate-100"
      />
      <p className="text-right text-xs font-medium text-slate-500">Character count: {value.length}</p>
    </div>
  )
}


export default JobDescriptionInput