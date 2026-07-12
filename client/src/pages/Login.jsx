import { useState } from 'react';
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
      <div className="flex items-center justify-center bg-ink-950 p-8">
        <form onSubmit={onSubmit} className="w-full max-w-sm space-y-5">
          <div>
            <h2 className="text-2xl font-semibold text-slate-100">Sign in to your account</h2>
            <p className="mt-1 text-sm text-slate-500">Enter your credentials to continue</p>
          </div>

          {error && (
            <div className="rounded-lg border border-status-retired/40 bg-status-retired/10 px-3 py-2 text-sm text-status-retired">
              {error}
            </div>
          )}

          <Field label="Email">
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" />
          </Field>
          <Field label="Password">
            <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required autoComplete="current-password" />
          </Field>

          <Button type="submit" className="w-full" disabled={submitting}>
            {submitting ? 'Signing in…' : 'Sign In'}
          </Button>

          <p className="text-center text-xs text-slate-600">
            Demo accounts use password <span className="font-mono text-slate-400">password123</span>
          </p>
        </form>
      </div>
    </div>
  );
}
