export function PageHeader({ title, subtitle, children }) {
  return (
    <div className="mb-6 rounded-[1.75rem] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-soft">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--muted-foreground)]">Overview</p>
          <h1 className="mt-3 text-3xl font-semibold text-[var(--foreground)]">{title}</h1>
          {subtitle && <p className="mt-2 max-w-2xl text-sm text-[var(--muted-foreground)]">{subtitle}</p>}
        </div>
        {children && <div className="flex flex-wrap items-center gap-3">{children}</div>}
      </div>
    </div>
  );
}
