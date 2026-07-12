import { asyncHandler } from '../../utils/asyncHandler.js';
import * as service from './analytics.service.js';

export const summary = asyncHandler(async (req, res) => {
  res.json({ data: await service.getAnalytics() });
});

export const exportCsv = asyncHandler(async (req, res) => {
  const csv = await service.exportAnalyticsCsv();
  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename="transitops-analytics.csv"');
  res.send(csv);
});
