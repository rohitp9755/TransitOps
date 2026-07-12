import { asyncHandler } from '../../utils/asyncHandler.js';
import * as service from './trips.service.js';

export const list = asyncHandler(async (req, res) => {
  res.json({ data: await service.listTrips(req.query) });
});
export const getOne = asyncHandler(async (req, res) => {
  res.json({ data: await service.getTrip(req.params.id) });
});
export const create = asyncHandler(async (req, res) => {
  res.status(201).json({ data: await service.createTrip(req.body) });
});
export const schedule = asyncHandler(async (req, res) => {
  res.json({ data: await service.scheduleTrip(req.params.id, req.body) });
});
export const dispatch = asyncHandler(async (req, res) => {
  res.json({ data: await service.dispatchTrip(req.params.id, req.user.role) });
});
export const start = asyncHandler(async (req, res) => {
  res.json({ data: await service.startTrip(req.params.id, req.user.role) });
});
export const progress = asyncHandler(async (req, res) => {
  res.json({ data: await service.progressTrip(req.params.id, req.user.role) });
});
export const complete = asyncHandler(async (req, res) => {
  res.json({ data: await service.completeTrip(req.params.id, req.body, req.user.role) });
});
export const cancel = asyncHandler(async (req, res) => {
  res.json({ data: await service.cancelTrip(req.params.id, req.user.role) });
});
export const options = asyncHandler(async (req, res) => {
  res.json({ data: await service.getDispatchOptions() });
});
