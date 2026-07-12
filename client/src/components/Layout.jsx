import { useEffect, useMemo, useState } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Moon, Search, Settings, SunMedium, Bell, Menu, X, ChevronRight, Home, Truck, Users, Package, Wrench, BarChart3, DollarSign } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { NAV_ITEMS, ROLE_LABELS } from '../lib/constants.js';

const ICONS = {
  '/': <Home size={18} />,
  '/analytics': <BarChart3 size={18} />,
  '/fleet': <Truck size={18} />,
  '/maintenance': <Wrench size={18} />,
  '/trips': <Package size={18} />,
  '/drivers': <Users size={18} />,
  '/expenses': <DollarSign size={18} />,
  '/settings': <Settings size={18} />,
};

function Logo() {
  return (
    <div className="flex items-center gap-3 px-5 py-6">
      <span className="grid h-12 w-12 place-items-center rounded-3xl bg-[var(--primary)]/15 text-[var(--primary)] shadow-sm shadow-[var(--primary)]/10">
        <span className="text-lg">▦</span>
      </span>
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--muted-foreground)]">TransitOps</p>
        <p className="text-xs text-[var(--muted-foreground)]">Fleet operations suite</p>
      </div>
    </div>
  );
}

function Sidebar({ mobileOpen, onClose }) {
  const { can } = useAuth();
  const items = NAV_ITEMS.filter((item) => can(item.module, 'view'));
  const sections = useMemo(() => {
    return items.reduce((groups, item) => {
      groups[item.section] = groups[item.section] || [];
      groups[item.section].push(item);
      return groups;
    }, {});
  }, [items]);

  const content = (
    <div className="flex h-full flex-col bg-[var(--surface)] text-[var(--foreground)] shadow-soft">
      <div className="border-b border-[var(--border)]">
        <Logo />
      </div>
      <div className="flex-1 overflow-y-auto px-3 py-4">
        {Object.entries(sections).map(([section, group]) => (
          <div key={section} className="mb-6 last:mb-0">
            <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-[0.3em] text-[var(--muted-foreground)]">{section}</p>
            <div className="space-y-2">
              {group.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === '/'}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-[var(--primary)]/10 text-[var(--primary)] ring-1 ring-[var(--primary)]/20'
                        : 'text-[var(--foreground)] hover:bg-[var(--surface-muted)] hover:text-[var(--primary)]'
                    }`
                  }
                >
                  <span className="text-[var(--primary)]">{ICONS[item.to]}</span>
                  {item.label}
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <>
      <aside className="hidden w-72 shrink-0 md:flex md:flex-col border-r border-[var(--border)] bg-[var(--surface)]">
        {content}
      </aside>
      {mobileOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 md:hidden" onClick={onClose} aria-hidden="true">
          <div className="pointer-events-none" />
        </div>
      )}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-72 transform bg-[var(--surface)] shadow-soft transition duration-300 md:hidden ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {content}
      </div>
    </>
  );
}

function Topbar({ onMenuToggle, theme, setTheme }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const initials = user?.name?.split(' ').map((p) => p[0]).slice(0, 2).join('') ?? '';
  const routeName = NAV_ITEMS.find((item) => item.to === location.pathname)?.label ?? 'TransitOps';
  const breadcrumbs = location.pathname.split('/').filter(Boolean);

  useEffect(() => {
    const close = () => setUserMenuOpen(false);
    window.addEventListener('click', close);
    return () => window.removeEventListener('click', close);
  }, []);

  return (
    <header className="flex items-center justify-between gap-4 border-b border-[var(--border)] bg-[var(--surface)] px-4 py-4 shadow-sm shadow-black/5 md:px-8">
      <div className="flex items-center gap-3">
        <button className="md:hidden rounded-2xl border border-[var(--border)] bg-[var(--surface-muted)] p-2 text-[var(--foreground)]" onClick={onMenuToggle} aria-label="Open navigation">
          <Menu size={18} />
        </button>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--muted-foreground)]">{routeName}</p>
          <div className="mt-1 flex items-center gap-2 text-sm text-[var(--muted-foreground)]">
            <span>Home</span>
            {breadcrumbs.map((crumb, index) => (
              <span key={crumb} className="inline-flex items-center gap-2">
                <ChevronRight size={14} />
                <span className="capitalize">{crumb.replace('-', ' ')}</span>
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-1 items-center justify-end gap-3">
        <div className="relative hidden w-full max-w-md items-center md:flex">
          <Search className="absolute left-4 text-[var(--muted-foreground)]" size={18} />
          <input
            type="search"
            placeholder="Search routes, vehicles, trips…"
            className="w-full rounded-2xl border border-[var(--border)] bg-[var(--surface)] py-3 pl-12 pr-4 text-sm text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/15"
          />
        </div>
        <button
          className="hidden items-center gap-2 rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm text-[var(--foreground)] transition hover:bg-[var(--surface-muted)] md:inline-flex"
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? <SunMedium size={16} /> : <Moon size={16} />}
          <span>{theme === 'dark' ? 'Light' : 'Dark'}</span>
        </button>
        <button className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-2 text-[var(--foreground)] hover:bg-[var(--surface-muted)]" aria-label="Notifications">
          <Bell size={18} />
          <span className="sr-only">Notifications</span>
        </button>
        <div className="relative">
          <button
            className="flex items-center gap-3 rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm text-[var(--foreground)]"
            onClick={(e) => {
              e.stopPropagation();
              setUserMenuOpen((open) => !open);
            }}
            aria-label="User menu"
          >
            <span className="grid h-10 w-10 place-items-center rounded-full bg-[var(--surface-muted)] text-sm font-semibold text-[var(--foreground)]">{initials}</span>
            <span className="hidden md:inline">{user?.name}</span>
          </button>
          {userMenuOpen && (
            <div className="absolute right-0 z-20 mt-2 w-56 rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-4 shadow-soft">
              <p className="text-sm font-semibold text-[var(--foreground)]">{user?.name}</p>
              <p className="mt-1 text-xs text-[var(--muted-foreground)]">{ROLE_LABELS[user?.role]}</p>
              <button
                className="mt-4 w-full rounded-2xl bg-[var(--surface-muted)] px-3 py-2 text-left text-sm text-[var(--foreground)] hover:bg-[var(--surface-elevated)]"
                onClick={() => navigate('/settings')}
              >
                Settings
              </button>
              <button
                className="mt-2 w-full rounded-2xl bg-[var(--destructive)]/10 px-3 py-2 text-left text-sm text-[var(--destructive)] hover:bg-[var(--destructive)]/15"
                onClick={() => {
                  logout();
                  navigate('/login');
                }}
              >
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export function Layout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [theme, setTheme] = useState('dark');

  useEffect(() => {
    const stored = window.localStorage.getItem('transitops-theme');
    if (stored) {
      setTheme(stored);
    }
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    window.localStorage.setItem('transitops-theme', theme);
  }, [theme]);

  return (
    <div className="flex h-screen overflow-hidden bg-[var(--background)] text-[var(--foreground)]">
      <Sidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Topbar onMenuToggle={() => setMobileOpen((open) => !open)} theme={theme} setTheme={setTheme} />
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
