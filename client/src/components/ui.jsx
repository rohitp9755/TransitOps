import { STATUS_STYLES } from '../lib/constants.js';

export function Button({ variant = 'primary', className = '', ...props }) {
  const base =
    'inline-flex items-center justify-center gap-2 rounded-2xl px-4 py-2 text-sm font-semibold transition duration-200 disabled:cursor-not-allowed disabled:opacity-50 focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2 focus-visible:ring-offset-ink-950';
  const variants = {
    primary: 'bg-primary text-slate-950 shadow-sm shadow-primary/20 hover:bg-primary-hover',
    secondary: 'bg-ink-800 text-slate-200 hover:bg-ink-700 border border-ink-700',
    ghost: 'text-slate-300 hover:bg-ink-800',
    danger: 'bg-status-retired/15 text-status-retired hover:bg-status-retired/25 border border-status-retired/30',
  };
  return <button className={`${base} ${variants[variant]} ${className}`} {...props} />;
}

export function Field({ label, error, children }) {
  return (
    <label className="block">
      {label && <span className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-slate-400">{label}</span>}
      {children}
      {error && <span className="mt-1 block text-xs text-status-retired">{error}</span>}
    </label>
  );
}

const inputBase =
  'w-full rounded-2xl border border-ink-700 bg-ink-800 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 transition duration-200 focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:opacity-60';

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
  return <div className={`rounded-[1.75rem] border border-ink-700 bg-ink-900/95 shadow-[0_18px_40px_rgba(0,0,0,0.22)] ${className}`} {...props} />;
}

export function Badge({ status }) {
  const s = STATUS_STYLES[status] ?? STATUS_STYLES.OFF_DUTY;
  return (
    <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold ${s.tint} ${s.text}`}>
      <span className={`h-2 w-2 rounded-full ${s.bg}`} />
      {s.label}
    </span>
  );
}

export function Spinner({ label = 'Loading…' }) {
  return (
    <div className="flex items-center justify-center gap-3 py-16 text-sm text-slate-400">
      <span className="h-4 w-4 animate-spin rounded-full border-2 border-ink-600 border-t-primary" />
      {label}
    </div>
  );
}

export function EmptyState({ title, hint }) {
  return (
    <div className="py-16 text-center">
      <p className="text-sm font-medium text-slate-300">{title}</p>
      {hint && <p className="mt-1 text-sm text-slate-500">{hint}</p>}
    </div>
  );
}

export function ErrorState({ message, onRetry }) {
  return (
    <div className="py-16 text-center">
      <p className="text-sm font-medium text-status-retired">{message}</p>
      {onRetry && (
        <Button variant="secondary" className="mt-3" onClick={onRetry}>
          Try again
        </Button>
      )}
    </div>
  );
}
