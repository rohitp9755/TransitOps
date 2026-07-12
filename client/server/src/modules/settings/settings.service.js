import { prisma } from '../../lib/prisma.js';
import { permissionsFor } from '../../config/permissions.js';

const ROLES = ['FLEET_MANAGER', 'DISPATCHER', 'SAFETY_OFFICER', 'FINANCIAL_ANALYST'];

const DEFAULTS = {
  depotName: 'Gandhinagar Depot GJ-01',
  currency: 'INR',
  distanceUnit: 'Kilometers',
};

const KEY = 'general';

export async function getSettings() {
  const row = await prisma.setting.findUnique({ where: { key: KEY } });
  const general = row ? { ...DEFAULTS, ...JSON.parse(row.value) } : DEFAULTS;
  // Ship the full RBAC grid so the Settings screen can render it read-only.
  const rbac = ROLES.map((role) => ({ role, permissions: permissionsFor(role) }));
  return { general, rbac };
}

export async function updateSettings(patch) {
  const current = await getSettings();
  const merged = { ...current.general, ...patch };
  await prisma.setting.upsert({
    where: { key: KEY },
    update: { value: JSON.stringify(merged) },
    create: { key: KEY, value: JSON.stringify(merged) },
  });
  return getSettings();
}
