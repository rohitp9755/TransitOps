import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/** Wipes transactional + master data so the seed is idempotent. */
async function reset() {
  await prisma.expense.deleteMany();
  await prisma.fuelLog.deleteMany();
  await prisma.maintenanceLog.deleteMany();
  await prisma.trip.deleteMany();
  await prisma.driver.deleteMany();
  await prisma.vehicle.deleteMany();
  await prisma.user.deleteMany();
  await prisma.setting.deleteMany();
}

async function seedUsers() {
  const password = await bcrypt.hash('password123', 10);
  const users = [
    { name: 'Fatima Khan', email: 'fleet@transitops.in', role: 'FLEET_MANAGER' },
    { name: 'Raven K.', email: 'ravenk@transitops.in', role: 'DISPATCHER' },
    { name: 'Sokka M.', email: 'safety@transitops.in', role: 'SAFETY_OFFICER' },
    { name: 'Iroh L.', email: 'finance@transitops.in', role: 'FINANCIAL_ANALYST' },
  ];
  await prisma.user.createMany({ data: users.map((u) => ({ ...u, passwordHash: password })) });
}

async function seedFleet() {
  const van05 = await prisma.vehicle.create({
    data: { regNumber: 'GJ01AB1452', name: 'VAN-05', type: 'Van', maxLoadKg: 500, odometer: 74000, acquisitionCost: 620000, region: 'West', status: 'AVAILABLE' },
  });
  const truckB = await prisma.vehicle.create({
    data: { regNumber: 'GJ01AB9998', name: 'TRUCK-B', type: 'Truck', maxLoadKg: 5000, odometer: 182000, acquisitionCost: 2450000, region: 'North', status: 'ON_TRIP' },
  });
  const mini03 = await prisma.vehicle.create({
    data: { regNumber: 'GJ01AB1120', name: 'MINI-03', type: 'MPV', maxLoadKg: 1000, odometer: 66000, acquisitionCost: 410000, region: 'West', status: 'IN_SHOP' },
  });
  const van09 = await prisma.vehicle.create({
    data: { regNumber: 'GJ01AB2008', name: 'VAN-09', type: 'Van', maxLoadKg: 750, odometer: 214900, acquisitionCost: 540000, region: 'South', status: 'RETIRED' },
  });
  return { van05, truckB, mini03, van09 };
}

async function seedDrivers() {
  const y = new Date().getFullYear();
  const alex = await prisma.driver.create({
    data: { name: 'Alex', licenseNumber: 'DL-8823', licenseCategory: 'LMV', licenseExpiry: new Date(`${y + 3}-12-31`), contact: '9876500000', safetyScore: 96, completionRate: 96, status: 'AVAILABLE' },
  });
  // John: expired license AND suspended — should be blocked from dispatch.
  const john = await prisma.driver.create({
    data: { name: 'John', licenseNumber: 'DL-4420', licenseCategory: 'HMV', licenseExpiry: new Date(`${y - 1}-03-31`), contact: '9822000000', safetyScore: 87, completionRate: 87, status: 'SUSPENDED' },
  });
  const priya = await prisma.driver.create({
    data: { name: 'Priya', licenseNumber: 'DL-7703', licenseCategory: 'LMV', licenseExpiry: new Date(`${y + 2}-09-30`), contact: '9980000000', safetyScore: 91, completionRate: 91, status: 'ON_TRIP' },
  });
  const suresh = await prisma.driver.create({
    data: { name: 'Suresh', licenseNumber: 'DL-9004S', licenseCategory: 'HMV', licenseExpiry: new Date(`${y + 1}-01-31`), contact: '9440000000', safetyScore: 88, completionRate: 88, status: 'OFF_DUTY' },
  });
  return { alex, john, priya, suresh };
}

async function main() {
  await reset();
  await seedUsers();
  const v = await seedFleet();
  const d = await seedDrivers();

  // Active dispatched trip (TRUCK-B + Priya, both already ON_TRIP).
  await prisma.trip.create({
    data: {
      code: 'TR001', source: 'Gandhinagar Depot', destination: 'Ahmedabad Hub',
      vehicleId: v.truckB.id, driverId: d.priya.id, cargoWeightKg: 3200, plannedDistanceKm: 48,
      revenue: 18000, status: 'DISPATCHED', dispatchedAt: new Date(), startOdometer: 182000,
    },
  });

  // Completed trips give analytics real numbers (distance, fuel, revenue).
  const completed = [
    { code: 'TR002', vehicleId: v.van05.id, driverId: d.alex.id, cargo: 420, dist: 60, rev: 9000, start: 73600, end: 73860, fuel: 31 },
    { code: 'TR003', vehicleId: v.truckB.id, driverId: d.suresh.id, cargo: 4800, dist: 120, rev: 26000, start: 181500, end: 181640, fuel: 44 },
  ];
  for (const t of completed) {
    await prisma.trip.create({
      data: {
        code: t.code, source: 'Vatva Industrial Area', destination: 'Sanand Warehouse',
        vehicleId: t.vehicleId, driverId: t.driverId, cargoWeightKg: t.cargo, plannedDistanceKm: t.dist,
        revenue: t.rev, status: 'COMPLETED', startOdometer: t.start, endOdometer: t.end,
        fuelConsumedL: t.fuel, dispatchedAt: new Date(Date.now() - 864e5), completedAt: new Date(Date.now() - 432e5),
      },
    });
  }

  // Active maintenance keeps MINI-03 in the shop.
  await prisma.maintenanceLog.create({
    data: { vehicleId: v.mini03.id, serviceType: 'Tyre Replace', cost: 6200, status: 'ACTIVE' },
  });
  await prisma.maintenanceLog.create({
    data: { vehicleId: v.truckB.id, serviceType: 'Engine Repair', cost: 18000, status: 'COMPLETED' },
  });
  await prisma.maintenanceLog.create({
    data: { vehicleId: v.van05.id, serviceType: 'Oil Change', cost: 2500, status: 'COMPLETED' },
  });

  // Fuel logs carry cost -> feed operational cost + ROI.
  await prisma.fuelLog.createMany({
    data: [
      { vehicleId: v.van05.id, liters: 42, cost: 3150, date: new Date() },
      { vehicleId: v.truckB.id, liters: 80, cost: 9400, date: new Date() },
      { vehicleId: v.mini03.id, liters: 28, cost: 2050, date: new Date() },
    ],
  });

  await prisma.expense.createMany({
    data: [
      { category: 'TOLL', amount: 120, vehicleId: v.van05.id },
      { category: 'TOLL', amount: 340, vehicleId: v.truckB.id },
    ],
  });

  console.log('Seed complete: 4 users (password123), 4 vehicles, 4 drivers, 3 trips.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
