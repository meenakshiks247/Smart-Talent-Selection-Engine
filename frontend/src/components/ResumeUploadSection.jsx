import ResumeUploader from './ResumeUploader'


function ResumeUploadSection({ files, onFilesChange, isAnalyzing = false }) {
  return (
    <section className="rounded-3xl border border-slate-200/80 bg-white/90 p-6 shadow-sm shadow-slate-900/5 sm:p-8">
      <div className="flex items-start gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100">
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M7 3h7l5 5v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Z" />
            <path d="M14 3v5h5" />
          </svg>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Candidate intake</p>
          <h2 className="mt-1 text-xl font-semibold text-slate-900">Resume Upload</h2>
          <p className="mt-1 text-sm text-slate-600">Upload one or more resumes to parse and score candidate profiles.</p>
        </div>
      </div>

      <p className="mt-4 text-xs text-slate-500">Supported formats: PDF, DOCX, JPG, JPEG, PNG</p>

      <ResumeUploader files={files} onFilesChange={onFilesChange} isAnalyzing={isAnalyzing} />
    </section>
  )
}

export default ResumeUploadSection