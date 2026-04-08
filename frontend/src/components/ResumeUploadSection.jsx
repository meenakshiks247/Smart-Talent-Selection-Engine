import ResumeUploader from './ResumeUploader'


function ResumeUploadSection({ onFilesChange }) {
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-lg font-medium text-slate-900">Resume Upload</h2>
      <p className="mt-1 text-sm text-slate-600">Upload one or more resumes to parse candidate profiles.</p>

      <ResumeUploader onFilesChange={onFilesChange} />

      <button
        type="button"
        className="mt-4 rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800"
      >
        Upload Resumes
      </button>
    </section>
  )
}

export default ResumeUploadSection