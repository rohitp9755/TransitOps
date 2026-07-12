import { prisma } from '../../lib/prisma.js';
import { ApiError } from '../../utils/ApiError.js';
import { assertDispatchable } from './trips.rules.js';

async function nextTripCode() {
  const count = await prisma.trip.count();
  return `TR${String(count + 1).padStart(3, '0')}`;
}

const tripInclude = {
  vehicle: { select: { id: true, regNumber: true, name: true, maxLoadKg: true, status: true } },
  driver: { select: { id: true, name: true, status: true, licenseExpiry: true } },
};

export function listTrips(filters = {}) {
  const { status, search } = filters;
  return prisma.trip.findMany({
    where: {
      ...(status && { status }),
      ...(search && {
        OR: [
          { code: { contains: search } },
          { source: { contains: search } },
          { destination: { contains: search } },
        ],
      }),
    },
    include: tripInclude,
    orderBy: { createdAt: 'desc' },
  });
}

export async function getTrip(id) {
  const trip = await prisma.trip.findUnique({ where: { id }, include: tripInclude });
  if (!trip) throw ApiError.notFound('Trip not found');
  return trip;
}

/** Loads a vehicle+driver pair or fails with a clear message. */
async function loadPair(vehicleId, driverId) {
  const [vehicle, driver] = await Promise.all([
    prisma.vehicle.findUnique({ where: { id: vehicleId } }),
    prisma.driver.findUnique({ where: { id: driverId } }),
  ]);
  if (!vehicle) throw ApiError.badRequest('Selected vehicle no longer exists');
  if (!driver) throw ApiError.badRequest('Selected driver no longer exists');
  return { vehicle, driver };
}

/** Creates a trip in DRAFT. Validates the pairing up front so drafts are sane. */
export async function createTrip(data) {
  const { vehicle, driver } = await loadPair(data.vehicleId, data.driverId);
  assertDispatchable(vehicle, driver, data.cargoWeightKg);
  const code = await nextTripCode();
  return prisma.trip.create({
    data: { ...data, code, status: 'DRAFT' },
    include: tripInclude,
  });
}

/**
 * DRAFT -> DISPATCHED. Re-validates (state may have changed since draft) and
 * flips both the vehicle and driver to ON_TRIP inside one transaction.
 */
export async function dispatchTrip(id) {
  const trip = await getTrip(id);
  if (trip.status !== 'DRAFT') {
    throw ApiError.conflict(`Only draft trips can be dispatched (this trip is ${trip.status.toLowerCase()})`);
  }
  const { vehicle, driver } = await loadPair(trip.vehicleId, trip.driverId);
  assertDispatchable(vehicle, driver, trip.cargoWeightKg);

  return prisma.$transaction(async (tx) => {
    await tx.vehicle.update({ where: { id: vehicle.id }, data: { status: 'ON_TRIP' } });
    await tx.driver.update({ where: { id: driver.id }, data: { status: 'ON_TRIP' } });
    return tx.trip.update({
      where: { id },
      data: { status: 'DISPATCHED', dispatchedAt: new Date(), startOdometer: vehicle.odometer },
      include: tripInclude,
    });
  });
}

/**
 * DISPATCHED -> COMPLETED. Records final odometer + fuel, advances the
 * vehicle odometer, and frees both vehicle and driver back to AVAILABLE.
 */
export async function completeTrip(id, { endOdometer, fuelConsumedL }) {
  const trip = await getTrip(id);
  if (trip.status !== 'DISPATCHED') {
    throw ApiError.conflict('Only a dispatched trip can be completed');
  }
  if (endOdometer < (trip.startOdometer ?? 0)) {
    throw ApiError.badRequest('Final odometer cannot be lower than the starting odometer');
  }

  return prisma.$transaction(async (tx) => {
    await tx.vehicle.update({
      where: { id: trip.vehicleId },
      data: { status: 'AVAILABLE', odometer: endOdometer },
    });
    await tx.driver.update({ where: { id: trip.driverId }, data: { status: 'AVAILABLE' } });
    return tx.trip.update({
      where: { id },
      data: { status: 'COMPLETED', completedAt: new Date(), endOdometer, fuelConsumedL },
      include: tripInclude,
    });
  });
}

/**
 * -> CANCELLED. A dispatched trip releases its vehicle and driver; a draft
 * simply closes (nothing was reserved).
 */
export async function cancelTrip(id) {
  const trip = await getTrip(id);
  if (trip.status === 'COMPLETED') throw ApiError.conflict('Completed trips cannot be cancelled');
  if (trip.status === 'CANCELLED') return trip;

  return prisma.$transaction(async (tx) => {
    if (trip.status === 'DISPATCHED') {
      await tx.vehicle.update({ where: { id: trip.vehicleId }, data: { status: 'AVAILABLE' } });
      await tx.driver.update({ where: { id: trip.driverId }, data: { status: 'AVAILABLE' } });
    }
    return tx.trip.update({ where: { id }, data: { status: 'CANCELLED' }, include: tripInclude });
  });
}

/** Dropdown feed for the dispatcher: only assignable vehicles and drivers. */
export async function getDispatchOptions() {
  const [vehicles, drivers] = await Promise.all([
    prisma.vehicle.findMany({ where: { status: 'AVAILABLE' }, orderBy: { regNumber: 'asc' } }),
    prisma.driver.findMany({ where: { status: 'AVAILABLE' }, orderBy: { name: 'asc' } }),
  ]);
  // Exclude expired licenses at the source so they never reach the UI.
  const eligibleDrivers = drivers.filter((d) => d.licenseExpiry.getTime() >= Date.now());
  return { vehicles, drivers: eligibleDrivers };
}
