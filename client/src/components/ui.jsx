import { STATUS_STYLES } from '../lib/constants.js';

export function Button({ variant = 'primary', className = '', ...props }) {
  const base =
    'inline-flex items-center justify-center gap-2 rounded-2xl px-4 py-2 text-sm font-semibold transition duration-200 disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]/25 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]';
  const variants = {
    primary: 'bg-[var(--primary)] text-[var(--primary-foreground)] shadow-sm shadow-[0_20px_40px_rgba(34,60,80,0.12)] hover:brightness-105',
    secondary: 'bg-[var(--surface)] text-[var(--foreground)] border border-[var(--border)] hover:bg-[var(--surface-muted)]',
    ghost: 'bg-transparent text-[var(--foreground)] hover:bg-[var(--surface-muted)]',
    danger: 'bg-[var(--destructive)]/10 text-[var(--destructive)] border border-[var(--destructive)]/20 hover:bg-[var(--destructive)]/15',
  };
  return <button className={`${base} ${variants[variant]} ${className}`} {...props} />;
}

export function Field({ label, error, children }) {
  return (
    <label className="block">
      {label && <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.3em] text-[var(--muted-foreground)]">{label}</span>}
      {children}
      {error && <span className="mt-2 block text-xs text-[var(--destructive)]">{error}</span>}
    </label>
  );
}

const inputBase =
  'w-full rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-sm text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] transition duration-200 focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/15 disabled:opacity-60';

export function Input(props) {
  return <input className={inputBase} {...props} />;
}

export function Select({ children, ...props }) {
  return (
    <select className={`${inputBase} appearance-none`} {...props}>
      {children}
    </select>
  );
}

export function Card({ className = '', ...props }) {
  return <div className={`card ${className}`} {...props} />;
}

export function Badge({ status, variant = 'default', className = '' }) {
  const s = STATUS_STYLES[status] ?? STATUS_STYLES.OFF_DUTY;
  const tone = {
    default: 'bg-[var(--surface-muted)] text-[var(--muted-foreground)]',
    success: 'bg-[var(--success)]/15 text-[var(--success)]',
    warning: 'bg-[var(--warning)]/15 text-[var(--warning)]',
    destructive: 'bg-[var(--destructive)]/15 text-[var(--destructive)]',
  }[variant];

  return (
    <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold ${tone} ${className}`}>
      <span className={`h-2.5 w-2.5 rounded-full ${s.bg}`} />
      {s.label}
    </span>
  );
}

export function StatTile({ icon, label, value, delta, caption }) {
  return (
    <div className="card p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--muted-foreground)]">{label}</p>
          <p className="mt-3 text-3xl font-semibold text-[var(--foreground)]">{value}</p>
        </div>
        {icon && <div className="grid h-12 w-12 place-items-center rounded-3xl bg-[var(--surface-muted)] text-[var(--primary)]">{icon}</div>}
      </div>
      {delta && <p className="mt-4 text-sm text-[var(--muted-foreground)]">{delta}</p>}
      {caption && <p className="mt-2 text-sm text-[var(--muted-foreground)]">{caption}</p>}
    </div>
  );
}

export function DataTable({ children, className = '' }) {
  return (
    <div className={`overflow-x-auto rounded-[1.5rem] border border-[var(--border)] bg-[var(--surface)] shadow-soft ${className}`}>
      <table className="min-w-full text-sm">{children}</table>
    </div>
  );
}

export function Skeleton({ className = '', ...props }) {
  return <div className={`animate-pulse rounded-2xl bg-[var(--surface-muted)] ${className}`} {...props} />;
}

export function Spinner({ label = 'Loading…' }) {
  return (
    <div className="flex items-center justify-center gap-3 py-16 text-sm text-[var(--muted-foreground)]">
      <span className="h-4 w-4 animate-spin rounded-full border-2 border-[var(--border)] border-t-[var(--primary)]" />
      {label}
    </div>
  );
}

export function EmptyState({ title, hint }) {
  return (
    <div className="py-16 text-center">
      <p className="text-sm font-semibold text-[var(--foreground)]">{title}</p>
      {hint && <p className="mt-2 text-sm text-[var(--muted-foreground)]">{hint}</p>}
    </div>
  );
}

export function ErrorState({ message, onRetry }) {
  return (
    <div className="py-16 text-center">
      <p className="text-sm font-semibold text-[var(--destructive)]">{message}</p>
      {onRetry && (
        <Button variant="secondary" className="mt-4" onClick={onRetry}>
          Try again
        </Button>
      )}
    </div>
  );
}
