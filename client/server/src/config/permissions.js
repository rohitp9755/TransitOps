/**
 * Role-Based Access Control matrix.
 *
 * Transcribed directly from the Settings & RBAC mockup (screen 8):
 *   module -> role -> access level ('edit' | 'view' | 'none')
 *
 * 'edit' implies 'view'. The `can()` helper below centralizes that rule so
 * routes only ever ask a single question: "may this role do X to Y?".
 *
 * Modules not shown in the mockup grid are mapped to the owning role per the
 * login screen's "Access is scoped by role" note:
 *   Fleet Manager -> Fleet, Maintenance   Dispatcher -> Dashboard, Trips
 *   Safety Officer -> Drivers, Compliance  Financial Analyst -> Fuel & Expenses, Analytics
 * Dashboard is readable by every authenticated role.
 */

export const MODULES = Object.freeze({
  DASHBOARD: 'dashboard',
  FLEET: 'fleet',
  DRIVERS: 'drivers',
  TRIPS: 'trips',
  MAINTENANCE: 'maintenance',
  EXPENSES: 'expenses',
  ANALYTICS: 'analytics',
  SETTINGS: 'settings',
});

const E = 'edit';
const V = 'view';
const N = 'none';

const MATRIX = {
  FLEET_MANAGER: {
    dashboard: V, fleet: E, drivers: E, trips: N,
    maintenance: E, expenses: N, analytics: V, settings: E,
  },
  DISPATCHER: {
    dashboard: V, fleet: V, drivers: N, trips: E,
    maintenance: N, expenses: N, analytics: N, settings: N,
  },
  SAFETY_OFFICER: {
    dashboard: V, fleet: N, drivers: E, trips: V,
    maintenance: N, expenses: N, analytics: N, settings: N,
  },
  FINANCIAL_ANALYST: {
    dashboard: V, fleet: V, drivers: N, trips: N,
    maintenance: N, expenses: E, analytics: E, settings: N,
  },
};

/** Returns true if `role` may perform `action` ('view' | 'edit') on `module`. */
export function can(role, module, action = 'view') {
  const level = MATRIX[role]?.[module] ?? N;
  if (level === N) return false;
  if (action === 'view') return level === V || level === E;
  return level === E; // action === 'edit'
}

/** Full permission map for a role — sent to the client to drive the UI. */
export function permissionsFor(role) {
  const map = MATRIX[role] ?? {};
  return Object.fromEntries(
    Object.entries(map).map(([mod, level]) => [
      mod,
      { view: level === V || level === E, edit: level === E },
    ]),
  );
}
