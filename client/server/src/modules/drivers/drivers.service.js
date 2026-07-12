import { prisma } from '../../lib/prisma.js';
import { ApiError } from '../../utils/ApiError.js';

/** Adds a derived `licenseExpired` flag so the UI can badge at-risk drivers. */
function decorate(driver) {
  return { ...driver, licenseExpired: driver.licenseExpiry.getTime() < Date.now() };
}

export async function listDrivers(filters = {}) {
  const { search, status } = filters;
  const drivers = await prisma.driver.findMany({
    where: {
      ...(status && { status }),
      ...(search && {
        OR: [{ name: { contains: search } }, { licenseNumber: { contains: search } }],
      }),
    },
    orderBy: { createdAt: 'desc' },
  });
  return drivers.map(decorate);
}

export async function getDriver(id) {
  const driver = await prisma.driver.findUnique({ where: { id } });
  if (!driver) throw ApiError.notFound('Driver not found');
  return decorate(driver);
}

export async function createDriver(data) {
  return decorate(await prisma.driver.create({ data }));
}

export async function updateDriver(id, data) {
  await getDriver(id);
  return decorate(await prisma.driver.update({ where: { id }, data }));
}

export async function deleteDriver(id) {
  await getDriver(id);
  const tripCount = await prisma.trip.count({ where: { driverId: id } });
  if (tripCount > 0) {
    throw ApiError.conflict('This driver has trip history and cannot be deleted. Set them Off Duty instead.');
  }
  await prisma.driver.delete({ where: { id } });
}
