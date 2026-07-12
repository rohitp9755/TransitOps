import { asyncHandler } from '../../utils/asyncHandler.js';
import * as service from './maintenance.service.js';

export const list = asyncHandler(async (req, res) => {
  res.json({ data: await service.listMaintenance(req.query) });
});
export const create = asyncHandler(async (req, res) => {
  res.status(201).json({ data: await service.openMaintenance(req.body) });
});
export const close = asyncHandler(async (req, res) => {
  res.json({ data: await service.closeMaintenance(req.params.id) });
});
