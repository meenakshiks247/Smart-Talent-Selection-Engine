function AppLayout({ children }) {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_#f8fafc_0%,_#eef2ff_45%,_#f8fafc_100%)]">
      <header className="border-b border-slate-200/80 bg-white/85 backdrop-blur">
        <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="grid gap-6 lg:grid-cols-[1.3fr_0.9fr] lg:items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-600">
                Recruiter Demo Dashboard
              </div>
              <h1 className="mt-4 max-w-2xl text-3xl font-black tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
                AI Resume Ranking System
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
                Rank candidates based on semantic matching with the job description.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
              <HeaderIndicator
                title="Resumes"
                description="Upload files"
                icon={
                  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path d="M7 3h7l5 5v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Z" />
                    <path d="M14 3v5h5" />
                    <path d="M9 13h6M9 17h6" strokeLinecap="round" />
                  </svg>
                }
              />
              <HeaderIndicator
                title="Job Description"
                description="Paste role details"
                icon={
                  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path d="M7 4h8l4 4v12a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1Z" />
                    <path d="M15 4v4h4" />
                    <path d="M9 12h6M9 16h5" strokeLinecap="round" />
                  </svg>
                }
              />
              <HeaderIndicator
                title="Ranked Candidates"
                description="Best matches first"
                icon={
                  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path d="M12 3l2.7 5.5L20 9l-4 3.9.9 5.5L12 15.8 7.1 18.4 8 12.9 4 9l5.3-.5L12 3Z" />
                  </svg>
                }
              />
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8">{children}</main>
    </div>
  )
}

function HeaderIndicator({ title, description, icon }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-3 py-3 shadow-sm">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-white">
        {icon}
      </div>
      <div>
        <p className="text-sm font-semibold text-slate-900">{title}</p>
        <p className="text-xs text-slate-500">{description}</p>
      </div>
    </div>
  )
}

export default AppLayout