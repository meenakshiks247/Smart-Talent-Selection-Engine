function AppLayout({ children, kpiItems = [], analysisStatus = 'idle', isAnalyzing = false, dataMode = 'live' }) {
  const statusConfig = getStatusConfig(analysisStatus, isAnalyzing)

  return (
    <div className="min-h-screen bg-[linear-gradient(130deg,_#f8fafc_0%,_#f1f5f9_28%,_#eff6ff_52%,_#f8fafc_100%)]">
      <div className="pointer-events-none fixed inset-x-0 top-0 z-0 h-56 bg-[radial-gradient(circle_at_top,_rgba(14,165,233,0.14),_transparent_70%)]" />

      <header className="sticky top-0 z-40 border-b border-slate-200/70 bg-white/80 backdrop-blur-xl">
        <div className="mx-auto flex w-full max-w-[1400px] items-center justify-between gap-6 px-4 py-4 sm:px-6 lg:px-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">Smart Talent Selection Engine</p>
            <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-[1.72rem]">
              Candidate Ranking Dashboard
            </h1>
            <p className="mt-1 text-sm text-slate-600">Enterprise-grade screening workspace for recruiter teams.</p>
          </div>

          <div className="hidden items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm md:flex">
            <span className={`h-2.5 w-2.5 rounded-full ${statusConfig.dot}`} aria-hidden="true" />
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Analysis status</p>
              <p className="text-sm font-semibold text-slate-800">{statusConfig.label}</p>
            </div>
          </div>
        </div>
      </header>

      <main className="relative z-10 mx-auto w-full max-w-[1400px] px-4 py-8 sm:px-6 lg:px-8">
        <section className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {kpiItems.map((item) => (
            <KpiCard key={item.title} title={item.title} helper={item.helper} value={item.value} />
          ))}
        </section>

        <div className="mt-8 grid gap-6 lg:grid-cols-[260px_minmax(0,1fr)]">
          <aside className="h-fit rounded-3xl border border-slate-200/80 bg-white/85 p-5 shadow-sm shadow-slate-900/5 backdrop-blur lg:sticky lg:top-24">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Workspace</p>
            <h2 className="mt-2 text-lg font-semibold text-slate-900">Recruiter Console</h2>
            <p className="mt-1 text-sm leading-6 text-slate-600">
              Upload resumes, add role context, and review semantic ranking in one place.
            </p>

            <div className="mt-5 space-y-3">
              <SidebarItem title="Resume Intake" subtitle="Drag and drop parser" />
              <SidebarItem title="Role Context" subtitle="Structured job summary" />
              <SidebarItem title="Ranking Review" subtitle="Score-based shortlisting" />
            </div>

            <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Environment</p>
              <p className="mt-1 text-sm font-medium text-slate-800">{dataMode === 'mock' ? 'Preview mode' : 'Live mode'}</p>
              <p className="mt-1 text-xs text-slate-500">{dataMode === 'mock' ? 'Using seeded demo candidates' : 'Connected to backend services'}</p>
            </div>
          </aside>

          <section>{children}</section>
        </div>
      </main>
    </div>
  )
}

function KpiCard({ title, helper, value }) {
  return (
    <article className="rounded-3xl border border-slate-200/90 bg-white/90 p-5 shadow-sm shadow-slate-900/5 backdrop-blur sm:p-6">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">{title}</p>
      <p className="mt-3 text-3xl font-bold tracking-tight text-slate-900">{value}</p>
      <p className="mt-1 text-sm text-slate-600">{helper}</p>
    </article>
  )
}

function SidebarItem({ title, subtitle }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white px-3 py-3">
      <p className="text-sm font-semibold text-slate-800">{title}</p>
      <p className="text-xs text-slate-500">{subtitle}</p>
    </div>
  )
}

function getStatusConfig(status, isAnalyzing) {
  if (isAnalyzing || status === 'loading') {
    return {
      dot: 'bg-sky-500 animate-pulse',
      label: 'Analyzing candidates',
    }
  }

  if (status === 'success') {
    return {
      dot: 'bg-emerald-500',
      label: 'Analysis completed',
    }
  }

  if (status === 'error') {
    return {
      dot: 'bg-rose-500',
      label: 'Needs attention',
    }
  }

  return {
    dot: 'bg-slate-400',
    label: 'Ready to run',
  }
}

export default AppLayout