// Single source of truth for cross-cutting UI constants.

export const ROLE_LABELS = {
  FLEET_MANAGER: 'Fleet Manager',
  DISPATCHER: 'Dispatcher',
  SAFETY_OFFICER: 'Safety Officer',
  FINANCIAL_ANALYST: 'Financial Analyst',
};

export const ROLE_OPTIONS = Object.entries(ROLE_LABELS).map(([value, label]) => ({ value, label }));

// Maps every status enum to its Tailwind text/bg/dot classes so badges stay
// consistent across Dashboard, Vehicles, Drivers, and Trips.
export const STATUS_STYLES = {
  AVAILABLE: { label: 'Available', text: 'text-status-available', bg: 'bg-status-available', tint: 'bg-status-available/15' },
  ON_TRIP: { label: 'On Trip', text: 'text-status-ontrip', bg: 'bg-status-ontrip', tint: 'bg-status-ontrip/15' },
  IN_SHOP: { label: 'In Shop', text: 'text-status-inshop', bg: 'bg-status-inshop', tint: 'bg-status-inshop/15' },
  RETIRED: { label: 'Retired', text: 'text-status-retired', bg: 'bg-status-retired', tint: 'bg-status-retired/15' },
  OFF_DUTY: { label: 'Off Duty', text: 'text-slate-400', bg: 'bg-slate-500', tint: 'bg-slate-500/15' },
  SUSPENDED: { label: 'Suspended', text: 'text-status-inshop', bg: 'bg-status-inshop', tint: 'bg-status-inshop/15' },
  // Trip statuses
  DRAFT: { label: 'Draft', text: 'text-slate-400', bg: 'bg-slate-500', tint: 'bg-slate-500/15' },
  DISPATCHED: { label: 'Dispatched', text: 'text-status-ontrip', bg: 'bg-status-ontrip', tint: 'bg-status-ontrip/15' },
  COMPLETED: { label: 'Completed', text: 'text-status-available', bg: 'bg-status-available', tint: 'bg-status-available/15' },
  CANCELLED: { label: 'Cancelled', text: 'text-status-retired', bg: 'bg-status-retired', tint: 'bg-status-retired/15' },
};

// Sidebar entries. `module` maps to the RBAC permission that gates visibility.
export const NAV_ITEMS = [
  { to: '/', label: 'Dashboard', module: 'dashboard' },
  { to: '/fleet', label: 'Fleet', module: 'fleet' },
  { to: '/drivers', label: 'Drivers', module: 'drivers' },
  { to: '/trips', label: 'Trips', module: 'trips' },
  { to: '/maintenance', label: 'Maintenance', module: 'maintenance' },
  { to: '/expenses', label: 'Fuel & Expenses', module: 'expenses' },
  { to: '/analytics', label: 'Analytics', module: 'analytics' },
  { to: '/settings', label: 'Settings', module: 'settings' },
];

export const currency = (n) =>
  new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format(Number(n) || 0);
