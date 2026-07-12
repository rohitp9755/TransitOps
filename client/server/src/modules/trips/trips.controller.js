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
export const dispatch = asyncHandler(async (req, res) => {
  res.json({ data: await service.dispatchTrip(req.params.id) });
});
export const complete = asyncHandler(async (req, res) => {
  res.json({ data: await service.completeTrip(req.params.id, req.body) });
});
export const cancel = asyncHandler(async (req, res) => {
  res.json({ data: await service.cancelTrip(req.params.id) });
});
export const options = asyncHandler(async (req, res) => {
  res.json({ data: await service.getDispatchOptions() });
});
