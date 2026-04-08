import ResumeUploader from './ResumeUploader'


function ResumeUploadSection({ files, onFilesChange }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/60">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100">
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M7 3h7l5 5v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Z" />
            <path d="M14 3v5h5" />
          </svg>
        </div>
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Resume Upload</h2>
          <p className="mt-1 text-sm text-slate-600">Upload one or more resumes to parse candidate profiles.</p>
        </div>
      </div>

      <ResumeUploader files={files} onFilesChange={onFilesChange} />
    </section>
  )
}

export default ResumeUploadSection