import { prisma } from '../../lib/prisma.js';

/**
 * ROI per vehicle = (revenue - (maintenance + fuel)) / acquisitionCost.
 * Revenue is taken from each trip's `revenue` field (see the assumption noted
 * in the README — the brief specifies the ROI formula but not a revenue source,
 * so trips carry a revenue amount).
 */
export async function getAnalytics() {
  const [vehicles, completedTrips, fuel, maintenance] = await Promise.all([
    prisma.vehicle.findMany(),
    prisma.trip.findMany({ where: { status: 'COMPLETED' } }),
    prisma.fuelLog.findMany(),
    prisma.maintenanceLog.findMany(),
  ]);

  const sumBy = (rows, key, field) =>
    rows.reduce((acc, r) => {
      acc[r[key]] = (acc[r[key]] ?? 0) + (r[field] ?? 0);
      return acc;
    }, {});

  const revenueByVehicle = sumBy(completedTrips, 'vehicleId', 'revenue');
  const fuelCostByVehicle = sumBy(fuel, 'vehicleId', 'cost');
  const maintCostByVehicle = sumBy(maintenance, 'vehicleId', 'cost');

  // Fleet-wide fuel efficiency = total actual distance / total fuel consumed.
  let totalDistance = 0;
  let totalFuel = 0;
  for (const t of completedTrips) {
    if (t.endOdometer != null && t.startOdometer != null) totalDistance += t.endOdometer - t.startOdometer;
    if (t.fuelConsumedL) totalFuel += t.fuelConsumedL;
  }
  const fuelEfficiency = totalFuel > 0 ? +(totalDistance / totalFuel).toFixed(1) : 0;

  const onTrip = vehicles.filter((v) => v.status === 'ON_TRIP').length;
  const nonRetired = vehicles.filter((v) => v.status !== 'RETIRED').length;
  const fleetUtilization = nonRetired > 0 ? Math.round((onTrip / nonRetired) * 100) : 0;

  const perVehicle = vehicles.map((v) => {
    const revenue = revenueByVehicle[v.id] ?? 0;
    const fuelCost = fuelCostByVehicle[v.id] ?? 0;
    const maintenanceCost = maintCostByVehicle[v.id] ?? 0;
    const operationalCost = fuelCost + maintenanceCost;
    const roi = v.acquisitionCost > 0 ? +(((revenue - operationalCost) / v.acquisitionCost) * 100).toFixed(1) : 0;
    return { id: v.id, regNumber: v.regNumber, name: v.name, revenue, operationalCost, fuelCost, maintenanceCost, roi };
  });

  const operationalCost = perVehicle.reduce((s, v) => s + v.operationalCost, 0);
  const totalRevenue = perVehicle.reduce((s, v) => s + v.revenue, 0);
  const fleetRoi = vehicles.reduce((s, v) => s + v.acquisitionCost, 0) > 0
    ? +(((totalRevenue - operationalCost) / vehicles.reduce((s, v) => s + v.acquisitionCost, 0)) * 100).toFixed(1)
    : 0;

  const topCostliest = [...perVehicle].sort((a, b) => b.operationalCost - a.operationalCost).slice(0, 5);

  // Monthly revenue from completed trips (YYYY-MM buckets).
  const revenueByMonth = {};
  for (const t of completedTrips) {
    const d = t.completedAt ?? t.createdAt;
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    revenueByMonth[key] = (revenueByMonth[key] ?? 0) + (t.revenue ?? 0);
  }
  const monthlyRevenue = Object.entries(revenueByMonth)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([month, revenue]) => ({ month, revenue }));

  return {
    summary: { fuelEfficiency, fleetUtilization, operationalCost, fleetRoi },
    perVehicle,
    topCostliest,
    monthlyRevenue,
  };
}

/** Flattens the per-vehicle analytics into a CSV string for download. */
export async function exportAnalyticsCsv() {
  const { perVehicle } = await getAnalytics();
  const header = ['Reg Number', 'Name', 'Revenue', 'Fuel Cost', 'Maintenance Cost', 'Operational Cost', 'ROI %'];
  const rows = perVehicle.map((v) =>
    [v.regNumber, v.name, v.revenue, v.fuelCost, v.maintenanceCost, v.operationalCost, v.roi].join(','),
  );
  return [header.join(','), ...rows].join('\n');
}
