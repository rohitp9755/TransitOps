import { prisma } from '../../lib/prisma.js';
import { ApiError } from '../../utils/ApiError.js';

const include = { vehicle: { select: { id: true, regNumber: true, name: true, status: true } } };

export function listMaintenance(filters = {}) {
  const { status, vehicleId } = filters;
  return prisma.maintenanceLog.findMany({
    where: { ...(status && { status }), ...(vehicleId && { vehicleId }) },
    include,
    orderBy: { createdAt: 'desc' },
  });
}

/**
 * Opening an active maintenance record pulls the vehicle out of service:
 * status -> IN_SHOP, which the dispatch options query already filters out.
 * A vehicle mid-trip must finish first; a retired vehicle can't be serviced.
 */
export async function openMaintenance(data) {
  const vehicle = await prisma.vehicle.findUnique({ where: { id: data.vehicleId } });
  if (!vehicle) throw ApiError.badRequest('Selected vehicle no longer exists');
  if (vehicle.status === 'ON_TRIP') {
    throw ApiError.conflict('Complete the vehicle\'s active trip before sending it to the shop');
  }
  if (vehicle.status === 'RETIRED') {
    throw ApiError.conflict('Retired vehicles cannot be serviced');
  }

  return prisma.$transaction(async (tx) => {
    const record = await tx.maintenanceLog.create({ data: { ...data, status: 'ACTIVE' }, include });
    await tx.vehicle.update({ where: { id: vehicle.id }, data: { status: 'IN_SHOP' } });
    return record;
  });
}

/** Closing maintenance returns the vehicle to AVAILABLE (unless retired). */
export async function closeMaintenance(id) {
  const record = await prisma.maintenanceLog.findUnique({ where: { id }, include });
  if (!record) throw ApiError.notFound('Maintenance record not found');
  if (record.status === 'COMPLETED') return record;

  return prisma.$transaction(async (tx) => {
    const updated = await tx.maintenanceLog.update({
      where: { id }, data: { status: 'COMPLETED' }, include,
    });
    if (record.vehicle.status !== 'RETIRED') {
      await tx.vehicle.update({ where: { id: record.vehicleId }, data: { status: 'AVAILABLE' } });
    }
    return updated;
  });
}
