import { prisma } from '../../lib/prisma.js';
import { ApiError } from '../../utils/ApiError.js';

export function listVehicles(filters = {}) {
  const { search, type, status, region } = filters;
  return prisma.vehicle.findMany({
    where: {
      ...(type && { type }),
      ...(status && { status }),
      ...(region && { region }),
      ...(search && {
        OR: [{ regNumber: { contains: search } }, { name: { contains: search } }],
      }),
    },
    orderBy: { createdAt: 'desc' },
  });
}

export async function getVehicle(id) {
  const vehicle = await prisma.vehicle.findUnique({ where: { id } });
  if (!vehicle) throw ApiError.notFound('Vehicle not found');
  return vehicle;
}

export function createVehicle(data) {
  return prisma.vehicle.create({ data });
}

export async function updateVehicle(id, data) {
  const vehicle = await getVehicle(id);
  // Guard the destructive transition: don't strand an active trip.
  if (data.status === 'RETIRED' && vehicle.status === 'ON_TRIP') {
    throw ApiError.conflict('Complete or cancel the active trip before retiring this vehicle');
  }
  return prisma.vehicle.update({ where: { id }, data });
}

export async function deleteVehicle(id) {
  await getVehicle(id);
  const tripCount = await prisma.trip.count({ where: { vehicleId: id } });
  if (tripCount > 0) {
    throw ApiError.conflict('This vehicle has trip history and cannot be deleted. Retire it instead.');
  }
  await prisma.vehicle.delete({ where: { id } });
}
