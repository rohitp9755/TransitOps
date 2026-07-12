import { asyncHandler } from '../../utils/asyncHandler.js';
import * as service from './vehicles.service.js';

export const list = asyncHandler(async (req, res) => {
  res.json({ data: await service.listVehicles(req.query) });
});

export const getOne = asyncHandler(async (req, res) => {
  res.json({ data: await service.getVehicle(req.params.id) });
});

export const create = asyncHandler(async (req, res) => {
  res.status(201).json({ data: await service.createVehicle(req.body) });
});

export const update = asyncHandler(async (req, res) => {
  res.json({ data: await service.updateVehicle(req.params.id, req.body) });
});

export const remove = asyncHandler(async (req, res) => {
  await service.deleteVehicle(req.params.id);
  res.status(204).send();
});
