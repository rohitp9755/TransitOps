import { ApiError } from '../../utils/ApiError.js';

/**
 * The mandatory dispatch rules from the brief, as a pure function with no I/O.
 * Kept separate from the service so the rules can be unit-tested in isolation
 * and reused by both draft-creation and dispatch.
 *
 * Throws ApiError.conflict on the first violation; returns silently when legal.
 * `ignoreOnTrip` lets draft creation skip the double-booking checks that only
 * matter at dispatch time.
 */
export function assertDispatchable(vehicle, driver, cargoWeightKg, { ignoreOnTrip = false } = {}) {
  if (vehicle.status === 'RETIRED' || vehicle.status === 'IN_SHOP') {
    throw ApiError.conflict(
      `Vehicle ${vehicle.regNumber} is ${vehicle.status.replace('_', ' ').toLowerCase()} and cannot be dispatched`,
    );
  }
  if (!ignoreOnTrip && vehicle.status === 'ON_TRIP') {
    throw ApiError.conflict(`Vehicle ${vehicle.regNumber} is already on a trip`);
  }
  if (driver.status === 'SUSPENDED') {
    throw ApiError.conflict(`Driver ${driver.name} is suspended and cannot be assigned`);
  }
  if (!ignoreOnTrip && driver.status === 'ON_TRIP') {
    throw ApiError.conflict(`Driver ${driver.name} is already on a trip`);
  }
  if (new Date(driver.licenseExpiry).getTime() < Date.now()) {
    throw ApiError.conflict(`Driver ${driver.name}'s license has expired`);
  }
  if (cargoWeightKg > vehicle.maxLoadKg) {
    throw ApiError.conflict(
      `Cargo weight (${cargoWeightKg} kg) exceeds ${vehicle.regNumber}'s capacity of ${vehicle.maxLoadKg} kg`,
    );
  }
}
