import { asyncHandler } from '../../utils/asyncHandler.js';
import * as service from './expenses.service.js';

export const listFuel = asyncHandler(async (req, res) => {
  res.json({ data: await service.listFuelLogs() });
});
export const createFuel = asyncHandler(async (req, res) => {
  res.status(201).json({ data: await service.createFuelLog(req.body) });
});
export const listExpenses = asyncHandler(async (req, res) => {
  res.json({ data: await service.listExpenses() });
});
export const createExpense = asyncHandler(async (req, res) => {
  res.status(201).json({ data: await service.createExpense(req.body) });
});
export const summary = asyncHandler(async (req, res) => {
  res.json({ data: await service.operationalCostSummary() });
});
