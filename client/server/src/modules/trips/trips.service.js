import { prisma } from '../../lib/prisma.js';
import { ApiError } from '../../utils/ApiError.js';
import { assertDispatchable } from './trips.rules.js';

const TRIP_STATUS = {
  DRAFT: 'DRAFT',
  SCHEDULED: 'SCHEDULED',
  ASSIGNED: 'ASSIGNED',
  STARTED: 'STARTED',
  IN_PROGRESS: 'IN_PROGRESS',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED',
};

const VALID_TRANSITIONS = {
  DRAFT: ['SCHEDULED', 'CANCELLED'],
  SCHEDULED: ['ASSIGNED', 'CANCELLED'],
  ASSIGNED: ['STARTED', 'CANCELLED'],
  STARTED: ['IN_PROGRESS', 'COMPLETED', 'CANCELLED'],
  IN_PROGRESS: ['COMPLETED', 'CANCELLED'],
  COMPLETED: [],
  CANCELLED: [],
};

const DISPATCH_ROLES = ['DISPATCHER'];
const OPERATIONAL_ROLES = ['DISPATCHER', 'FLEET_MANAGER'];

function assertRole(role, allowed, action) {
  if (!allowed.includes(role)) {
    throw ApiError.forbidden(`Your role cannot ${action} this trip`);
  }
}

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

async function loadPair(vehicleId, driverId) {
  const [vehicle, driver] = await Promise.all([
    prisma.vehicle.findUnique({ where: { id: vehicleId } }),
    prisma.driver.findUnique({ where: { id: driverId } }),
  ]);
  if (!vehicle) throw ApiError.badRequest('Selected vehicle no longer exists');
  if (!driver) throw ApiError.badRequest('Selected driver no longer exists');
  return { vehicle, driver };
}

function assertTransition(current, next) {
  if (!VALID_TRANSITIONS[current]?.includes(next)) {
    throw ApiError.conflict(`Cannot transition trip from ${current.toLowerCase()} to ${next.toLowerCase()}`);
  }
}

function assertHasSchedule(trip) {
  if (!trip.plannedStart || !trip.plannedEnd) {
    throw ApiError.conflict('A trip must have a scheduled start and end before it can be dispatched');
  }
  if (trip.plannedEnd.getTime() <= trip.plannedStart.getTime()) {
    throw ApiError.badRequest('Trip end time must be after the start time');
  }
}

function assertTimingAgainstLicense(driver, plannedStart) {
  if (new Date(driver.licenseExpiry).getTime() < Date.now()) {
    throw ApiError.conflict(`Driver ${driver.name}'s license has expired`);
  }
  if (plannedStart && new Date(driver.licenseExpiry).getTime() < plannedStart.getTime()) {
    throw ApiError.conflict(`Driver ${driver.name}'s license expires before the scheduled trip start`);
  }
}

async function countScheduleConflicts({ vehicleId, driverId, plannedStart, plannedEnd, excludeTripId }) {
  const conflictStatuses = ['SCHEDULED', 'ASSIGNED', 'STARTED', 'IN_PROGRESS'];
  const overlapClause = {
    plannedStart: { lte: plannedEnd },
    plannedEnd: { gte: plannedStart },
  };

  const [vehicleConflicts, driverConflicts] = await Promise.all([
    prisma.trip.count({
      where: {
        id: excludeTripId ? { not: excludeTripId } : undefined,
        vehicleId,
        status: { in: conflictStatuses },
        AND: [overlapClause],
      },
    }),
    prisma.trip.count({
      where: {
        id: excludeTripId ? { not: excludeTripId } : undefined,
        driverId,
        status: { in: conflictStatuses },
        AND: [overlapClause],
      },
    }),
  ]);

  return { vehicleConflicts, driverConflicts };
}

export async function createTrip(data) {
  const { vehicle, driver } = await loadPair(data.vehicleId, data.driverId);
  assertDispatchable(vehicle, driver, data.cargoWeightKg, { ignoreOnTrip: true });
  const code = await nextTripCode();
  return prisma.trip.create({
    data: { ...data, code, status: TRIP_STATUS.DRAFT },
    include: tripInclude,
  });
}

export async function scheduleTrip(id, { plannedStart, plannedEnd }) {
  const trip = await getTrip(id);
  if (trip.status !== TRIP_STATUS.DRAFT) {
    throw ApiError.conflict('Only draft trips can be scheduled');
  }
  if (plannedEnd.getTime() <= plannedStart.getTime()) {
    throw ApiError.badRequest('Trip end time must be after the start time');
  }

  const { vehicle, driver } = await loadPair(trip.vehicleId, trip.driverId);
  assertDispatchable(vehicle, driver, trip.cargoWeightKg, { ignoreOnTrip: true });
  assertTimingAgainstLicense(driver, plannedStart);

  const { vehicleConflicts, driverConflicts } = await countScheduleConflicts({
    vehicleId: vehicle.id,
    driverId: driver.id,
    plannedStart,
    plannedEnd,
    excludeTripId: id,
  });
  if (vehicleConflicts > 0) {
    throw ApiError.conflict('The selected vehicle is already booked during this time window');
  }
  if (driverConflicts > 0) {
    throw ApiError.conflict('The selected driver is already booked during this time window');
  }

  assertTransition(trip.status, TRIP_STATUS.SCHEDULED);
  return prisma.trip.update({
    where: { id },
    data: { status: TRIP_STATUS.SCHEDULED, plannedStart, plannedEnd },
    include: tripInclude,
  });
}

export async function dispatchTrip(id, role) {
  assertRole(role, DISPATCH_ROLES, 'dispatch');
  const trip = await getTrip(id);
  assertTransition(trip.status, TRIP_STATUS.ASSIGNED);
  assertHasSchedule(trip);

  const { vehicle, driver } = await loadPair(trip.vehicleId, trip.driverId);
  assertDispatchable(vehicle, driver, trip.cargoWeightKg);
  assertTimingAgainstLicense(driver, trip.plannedStart);

  const { vehicleConflicts, driverConflicts } = await countScheduleConflicts({
    vehicleId: vehicle.id,
    driverId: driver.id,
    plannedStart: trip.plannedStart,
    plannedEnd: trip.plannedEnd,
    excludeTripId: id,
  });
  if (vehicleConflicts > 0) {
    throw ApiError.conflict('The selected vehicle is already booked during the scheduled trip window');
  }
  if (driverConflicts > 0) {
    throw ApiError.conflict('The selected driver is already booked during the scheduled trip window');
  }

  return prisma.$transaction(async (tx) => {
    await tx.vehicle.update({ where: { id: vehicle.id }, data: { status: TRIP_STATUS.ASSIGNED } });
    await tx.driver.update({ where: { id: driver.id }, data: { status: TRIP_STATUS.ASSIGNED } });
    return tx.trip.update({
      where: { id },
      data: { status: TRIP_STATUS.ASSIGNED, dispatchedAt: new Date() },
      include: tripInclude,
    });
  });
}

export async function startTrip(id, role) {
  assertRole(role, OPERATIONAL_ROLES, 'start');
  const trip = await getTrip(id);
  assertTransition(trip.status, TRIP_STATUS.STARTED);

  const { vehicle, driver } = await loadPair(trip.vehicleId, trip.driverId);
  if (vehicle.status === 'IN_SHOP' || vehicle.status === 'RETIRED') {
    throw ApiError.conflict('Vehicle cannot start because it is unavailable');
  }
  if (driver.status === 'SUSPENDED') {
    throw ApiError.conflict('Driver cannot start because they are suspended');
  }

  return prisma.$transaction(async (tx) => {
    const updatedVehicle = await tx.vehicle.update({
      where: { id: vehicle.id },
      data: { status: 'ON_TRIP' },
    });
    await tx.driver.update({ where: { id: driver.id }, data: { status: 'ON_TRIP' } });
    return tx.trip.update({
      where: { id },
      data: {
        status: TRIP_STATUS.STARTED,
        startedAt: new Date(),
        startOdometer: trip.startOdometer ?? updatedVehicle.odometer,
      },
      include: tripInclude,
    });
  });
}

export async function progressTrip(id, role) {
  assertRole(role, OPERATIONAL_ROLES, 'progress');
  const trip = await getTrip(id);
  assertTransition(trip.status, TRIP_STATUS.IN_PROGRESS);
  return prisma.trip.update({ where: { id }, data: { status: TRIP_STATUS.IN_PROGRESS }, include: tripInclude });
}

export async function completeTrip(id, { endOdometer, fuelConsumedL }, role) {
  assertRole(role, OPERATIONAL_ROLES, 'complete');
  const trip = await getTrip(id);
  if (![TRIP_STATUS.STARTED, TRIP_STATUS.IN_PROGRESS].includes(trip.status)) {
    throw ApiError.conflict('Only an active trip can be completed');
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
      data: {
        status: TRIP_STATUS.COMPLETED,
        completedAt: new Date(),
        endOdometer,
        fuelConsumedL,
      },
      include: tripInclude,
    });
  });
}

export async function cancelTrip(id, role) {
  assertRole(role, OPERATIONAL_ROLES, 'cancel');
  const trip = await getTrip(id);
  if (trip.status === TRIP_STATUS.COMPLETED) throw ApiError.conflict('Completed trips cannot be cancelled');
  if (trip.status === TRIP_STATUS.CANCELLED) return trip;

  return prisma.$transaction(async (tx) => {
    if ([TRIP_STATUS.ASSIGNED, TRIP_STATUS.STARTED, TRIP_STATUS.IN_PROGRESS].includes(trip.status)) {
      await tx.vehicle.update({ where: { id: trip.vehicleId }, data: { status: 'AVAILABLE' } });
      await tx.driver.update({ where: { id: trip.driverId }, data: { status: 'AVAILABLE' } });
    }
    return tx.trip.update({ where: { id }, data: { status: TRIP_STATUS.CANCELLED }, include: tripInclude });
  });
}

export async function getDispatchOptions() {
  const [vehicles, drivers] = await Promise.all([
    prisma.vehicle.findMany({ where: { status: 'AVAILABLE' }, orderBy: { regNumber: 'asc' } }),
    prisma.driver.findMany({ where: { status: 'AVAILABLE' }, orderBy: { name: 'asc' } }),
  ]);
  const eligibleDrivers = drivers.filter((d) => new Date(d.licenseExpiry).getTime() >= Date.now());
  return { vehicles, drivers: eligibleDrivers };
}
