import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { NAV_ITEMS, ROLE_LABELS } from '../lib/constants.js';

function Logo() {
  return (
    <div className="flex items-center gap-2.5 px-5 py-5">
      <span className="grid h-8 w-8 place-items-center rounded-md bg-primary/20 text-primary">
        <span className="text-lg">▦</span>
      </span>
      <span className="text-lg font-bold tracking-tight text-slate-100">TransitOps</span>
    </div>
  );
}

function Sidebar() {
  const { can } = useAuth();
  // Only show nav entries the current role can at least view.
  const items = NAV_ITEMS.filter((item) => can(item.module, 'view'));

  return (
    <aside className="hidden w-56 shrink-0 flex-col border-r border-ink-800 bg-ink-900 md:flex">
      <Logo />
      <nav className="flex-1 space-y-1 px-3 py-2">
        {items.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) =>
              `block rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                isActive ? 'bg-primary text-white' : 'text-slate-400 hover:bg-ink-800 hover:text-slate-200'
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
    <header className="flex items-center justify-between border-b border-ink-800 bg-ink-900 px-6 py-3">
      <input
        type="search"
        placeholder="Search…"
        className="w-64 max-w-full rounded-lg border border-ink-700 bg-ink-800 px-3 py-1.5 text-sm text-slate-200 placeholder:text-slate-500 focus:border-primary"
      />
      <div className="flex items-center gap-3">
        <div className="text-right">
          <p className="text-sm font-medium text-slate-200">{user?.name}</p>
          <p className="text-xs text-slate-500">{ROLE_LABELS[user?.role]}</p>
        </div>
        <span className="grid h-9 w-9 place-items-center rounded-full bg-status-ontrip/20 text-sm font-semibold text-status-ontrip">
          {initials}
        </span>
        <button
          onClick={() => { logout(); navigate('/login'); }}
          className="rounded-lg px-3 py-1.5 text-sm text-slate-400 hover:bg-ink-800 hover:text-slate-200"
        >
          Sign out
        </button>
      </div>
    </header>
  );
}

export function Layout() {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Topbar />
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
