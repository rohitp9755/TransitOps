import { asyncHandler } from '../../utils/asyncHandler.js';
import * as service from './settings.service.js';

export const get = asyncHandler(async (req, res) => {
  res.json({ data: await service.getSettings() });
});
export const update = asyncHandler(async (req, res) => {
  res.json({ data: await service.updateSettings(req.body) });
});
