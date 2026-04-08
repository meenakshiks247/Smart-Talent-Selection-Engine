import { useState } from 'react'

function JobDescriptionInput({ initialValue = '', onValueChange }) {
  const [description, setDescription] = useState(initialValue)

  function handleChange(event) {
    const nextValue = event.target.value
    setDescription(nextValue)

    if (typeof onValueChange === 'function') {
      onValueChange(nextValue)
    }
  }

  return (
    <div className="mt-4 space-y-2">
      <label htmlFor="jobDescriptionInput" className="mb-2 block text-sm font-medium text-slate-700">
        Job Description
      </label>
      <textarea
        id="jobDescriptionInput"
        rows={10}
        value={description}
        onChange={handleChange}
        placeholder="Paste the job description here..."
        className="min-h-64 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm leading-6 text-slate-700 shadow-sm transition placeholder:text-slate-400 focus:border-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-200"
      />
      <p className="text-right text-xs font-medium text-slate-500">Character count: {description.length}</p>
    </div>
  )
}


export default JobDescriptionInput