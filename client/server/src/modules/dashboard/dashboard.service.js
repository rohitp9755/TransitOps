import { prisma } from '../../lib/prisma.js';

/**
 * All dashboard numbers are derived live from current state so the KPIs can
 * never drift from the underlying records.
 */
export async function getDashboard(filters = {}) {
  const { type, status, region } = filters;
  const vehicleWhere = { ...(type && { type }), ...(status && { status }), ...(region && { region }) };

  const [vehicles, drivers, tripStatus, recentTrips] = await Promise.all([
    prisma.vehicle.groupBy({ by: ['status'], where: vehicleWhere, _count: true }),
    prisma.driver.groupBy({ by: ['status'], _count: true }),
    prisma.trip.groupBy({ by: ['status'], _count: true }),
    prisma.trip.findMany({
      take: 6,
      orderBy: { createdAt: 'desc' },
      include: {
        vehicle: { select: { regNumber: true } },
        driver: { select: { name: true } },
      },
    }),
  ]);

  const vCount = (s) => vehicles.find((v) => v.status === s)?._count ?? 0;
  const dCount = (s) => drivers.find((d) => d.status === s)?._count ?? 0;
  const tCount = (s) => tripStatus.find((t) => t.status === s)?._count ?? 0;

  const available = vCount('AVAILABLE');
  const onTrip = vCount('ON_TRIP');
  const inShop = vCount('IN_SHOP');
  const activeVehicles = available + onTrip + inShop; // all non-retired
  const fleetUtilization = activeVehicles > 0 ? Math.round((onTrip / activeVehicles) * 100) : 0;

  return {
    kpis: {
      activeVehicles,
      availableVehicles: available,
      vehiclesInMaintenance: inShop,
      activeTrips: tCount('DISPATCHED'),
      pendingTrips: tCount('DRAFT'),
      driversOnDuty: dCount('AVAILABLE') + dCount('ON_TRIP'),
      fleetUtilization,
    },
    vehicleStatus: {
      AVAILABLE: available,
      ON_TRIP: onTrip,
      IN_SHOP: inShop,
      RETIRED: vCount('RETIRED'),
    },
    recentTrips: recentTrips.map((t) => ({
      id: t.id,
      code: t.code,
      vehicle: t.vehicle?.regNumber ?? '—',
      driver: t.driver?.name ?? '—',
      status: t.status,
    })),
  };
}
