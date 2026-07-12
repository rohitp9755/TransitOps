export function PageHeader({ title, subtitle, children }) {
  return (
    <div className="mb-6 flex flex-col gap-4 rounded-[1.75rem] border border-ink-700 bg-ink-900/95 px-6 py-6 shadow-[0_18px_40px_rgba(0,0,0,0.18)] sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Overview</p>
        <h1 className="mt-2 text-3xl font-semibold text-slate-100">{title}</h1>
        {subtitle && <p className="mt-2 max-w-2xl text-sm text-slate-400">{subtitle}</p>}
      </div>
      {children && <div className="flex flex-wrap items-center gap-3">{children}</div>}
    </div>
  );
}
