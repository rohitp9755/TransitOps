import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { NAV_ITEMS, ROLE_LABELS } from '../lib/constants.js';

function Logo() {
  return (
    <div className="flex items-center gap-3 px-5 py-6">
      <span className="grid h-11 w-11 place-items-center rounded-2xl bg-primary/15 text-primary shadow-sm shadow-primary/10">
        <span className="text-lg">▦</span>
      </span>
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">TransitOps</p>
        <p className="text-xs text-slate-400">Operations dashboard</p>
      </div>
    </div>
  );
}

function Sidebar() {
  const { can } = useAuth();
  // Only show nav entries the current role can at least view.
  const items = NAV_ITEMS.filter((item) => can(item.module, 'view'));

  return (
    <aside className="hidden w-64 shrink-0 flex-col border-r border-ink-800 bg-ink-900/95 backdrop-blur-md md:flex">
      <Logo />
      <nav className="flex-1 space-y-1 px-3 py-4">
        {items.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) =>
              `block rounded-2xl px-4 py-3 text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-primary/10 text-primary ring-1 ring-primary/20'
                  : 'text-slate-300 hover:bg-ink-800 hover:text-slate-100'
              }`
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}

function Topbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const initials = user?.name?.split(' ').map((p) => p[0]).slice(0, 2).join('') ?? '';

  return (
    <header className="flex items-center justify-between gap-4 border-b border-ink-800 bg-ink-950/90 px-6 py-4 shadow-sm shadow-black/10">
      <div className="flex flex-1 items-center gap-4">
        <input
          type="search"
          placeholder="Search…"
          className="w-full max-w-md rounded-2xl border border-ink-700 bg-ink-900 px-4 py-2 text-sm text-slate-200 placeholder:text-slate-500 shadow-sm shadow-black/10 focus:border-primary focus:ring-2 focus:ring-primary/20"
        />
      </div>
      <div className="flex items-center gap-3">
        <div className="text-right">
          <p className="text-sm font-semibold text-slate-100">{user?.name}</p>
          <p className="text-xs text-slate-500">{ROLE_LABELS[user?.role]}</p>
        </div>
        <span className="grid h-10 w-10 place-items-center rounded-full bg-status-ontrip/20 text-sm font-semibold text-status-ontrip shadow-sm shadow-status-ontrip/10">
          {initials}
        </span>
        <button
          onClick={() => {
            logout();
            navigate('/login');
          }}
          className="rounded-2xl border border-ink-700 bg-ink-900 px-3 py-2 text-sm text-slate-300 transition hover:bg-ink-800 hover:text-slate-100"
        >
          Sign out
        </button>
      </div>
    </header>
  );
}

export function Layout() {
  return (
    <div className="flex h-screen overflow-hidden bg-ink-950 text-slate-100">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Topbar />
        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
