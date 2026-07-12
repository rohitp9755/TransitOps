import { prisma } from '../../lib/prisma.js';

const fuelInclude = { vehicle: { select: { id: true, regNumber: true, name: true } } };
const expenseInclude = {
  vehicle: { select: { id: true, regNumber: true, name: true } },
  trip: { select: { id: true, code: true, status: true } },
};

export function listFuelLogs() {
  return prisma.fuelLog.findMany({ include: fuelInclude, orderBy: { date: 'desc' } });
}

export function createFuelLog(data) {
  return prisma.fuelLog.create({ data, include: fuelInclude });
}

export function listExpenses() {
  return prisma.expense.findMany({ include: expenseInclude, orderBy: { date: 'desc' } });
}

export function createExpense(data) {
  return prisma.expense.create({ data, include: expenseInclude });
}

/**
 * Operational cost per vehicle = fuel spend + maintenance spend.
 * Computed on read so it always reflects the latest logs (no stale rollups).
 */
export async function operationalCostSummary() {
  const [vehicles, fuel, maintenance] = await Promise.all([
    prisma.vehicle.findMany({ select: { id: true, regNumber: true, name: true } }),
    prisma.fuelLog.groupBy({ by: ['vehicleId'], _sum: { cost: true } }),
    prisma.maintenanceLog.groupBy({ by: ['vehicleId'], _sum: { cost: true } }),
  ]);

  const fuelBy = Object.fromEntries(fuel.map((f) => [f.vehicleId, f._sum.cost ?? 0]));
  const maintBy = Object.fromEntries(maintenance.map((m) => [m.vehicleId, m._sum.cost ?? 0]));

  const rows = vehicles.map((v) => {
    const fuelCost = fuelBy[v.id] ?? 0;
    const maintenanceCost = maintBy[v.id] ?? 0;
    return { ...v, fuelCost, maintenanceCost, operationalCost: fuelCost + maintenanceCost };
  });

  const total = rows.reduce((sum, r) => sum + r.operationalCost, 0);
  return { rows, total };
}
