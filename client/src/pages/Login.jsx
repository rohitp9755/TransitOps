import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { Button, Field, Input } from '../components/ui.jsx';

const ROLE_SCOPES = [
  ['Fleet Manager', 'Fleet, Maintenance'],
  ['Dispatcher', 'Dashboard, Trips'],
  ['Safety Officer', 'Drivers, Compliance'],
  ['Financial Analyst', 'Fuel & Expenses, Analytics'],
];

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('ravenk@transitops.in');
  const [password, setPassword] = useState('password123');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await login(email, password);
      navigate(location.state?.from?.pathname || '/', { replace: true });
    } catch (err) {
      setError(err.status === 401 ? 'Invalid credentials' : err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="grid min-h-screen md:grid-cols-2">
      {/* Brand panel */}
      <div className="hidden flex-col justify-between bg-ink-900 p-10 md:flex">
        <div>
          <div className="flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-lg bg-primary/20 text-2xl text-primary">▦</span>
            <div>
              <h1 className="text-2xl font-bold text-slate-100">TransitOps</h1>
              <p className="text-sm text-slate-500">Smart Transport Operations Platform</p>
            </div>
          </div>
        </div>
        <div>
          <p className="mb-4 text-sm font-medium text-slate-400">One login, four roles</p>
          <ul className="space-y-3">
            {ROLE_SCOPES.map(([role, scope]) => (
              <li key={role} className="flex items-baseline gap-3 text-sm">
                <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                <span className="font-medium text-slate-200">{role}</span>
                <span className="text-slate-500">→ {scope}</span>
              </li>
            ))}
          </ul>
        </div>
        <p className="text-xs text-slate-600">TransitOps © 2026</p>
      </div>

      {/* Form panel */}
      <div className="flex items-center justify-center bg-[var(--background)] p-8">
        <form onSubmit={onSubmit} className="w-full max-w-md space-y-6 rounded-[1.75rem] border border-[var(--border)] bg-[var(--surface)] p-8 shadow-soft">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--muted-foreground)]">Welcome back</p>
            <h2 className="mt-3 text-3xl font-semibold text-[var(--foreground)]">Sign in to TransitOps</h2>
            <p className="mt-2 text-sm text-[var(--muted-foreground)]">Use your credentials to access operations, fleet, and analytics.</p>
          </div>

          {error && (
            <div className="rounded-2xl border border-[var(--destructive)]/30 bg-[var(--destructive)]/10 px-4 py-3 text-sm text-[var(--destructive)]">
              {error}
            </div>
          )}

          <Field label="Email">
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" />
          </Field>
          <Field label="Password">
            <div className="relative">
              <Input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword((value) => !value)}
                className="absolute inset-y-0 right-3 grid place-items-center text-[var(--muted-foreground)]"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </Field>

          <Button type="submit" className="w-full" disabled={submitting}>
            {submitting ? 'Signing in…' : 'Sign In'}
          </Button>

          <p className="text-center text-xs text-[var(--muted-foreground)]">
            Demo accounts use password <span className="font-mono text-[var(--foreground)]">password123</span>
          </p>
        </form>
      </div>
    </div>
  );
}
