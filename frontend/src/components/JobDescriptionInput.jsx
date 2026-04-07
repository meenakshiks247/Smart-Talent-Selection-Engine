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
    <div className="mt-4">
      <label htmlFor="jobDescriptionInput" className="mb-2 block text-sm font-medium text-slate-700">
        Job Description
      </label>
      <textarea
        id="jobDescriptionInput"
        rows={10}
        value={description}
        onChange={handleChange}
        placeholder="Paste the job description here..."
        className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm leading-6 text-slate-700 shadow-sm focus:border-slate-500 focus:outline-none"
      />
      <p className="mt-2 text-right text-xs text-slate-500">Character count: {description.length}</p>
    </div>
  )
}


export default JobDescriptionInput