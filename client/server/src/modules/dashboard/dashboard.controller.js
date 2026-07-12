import { asyncHandler } from '../../utils/asyncHandler.js';
import * as service from './dashboard.service.js';

export const summary = asyncHandler(async (req, res) => {
  res.json({ data: await service.getDashboard(req.query) });
});
