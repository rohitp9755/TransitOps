import { asyncHandler } from '../../utils/asyncHandler.js';
import * as service from './drivers.service.js';

export const list = asyncHandler(async (req, res) => {
  res.json({ data: await service.listDrivers(req.query) });
});
export const getOne = asyncHandler(async (req, res) => {
  res.json({ data: await service.getDriver(req.params.id) });
});
export const create = asyncHandler(async (req, res) => {
  res.status(201).json({ data: await service.createDriver(req.body) });
});
export const update = asyncHandler(async (req, res) => {
  res.json({ data: await service.updateDriver(req.params.id, req.body) });
});
export const remove = asyncHandler(async (req, res) => {
  await service.deleteDriver(req.params.id);
  res.status(204).send();
});
