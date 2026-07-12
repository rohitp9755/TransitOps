import { Router } from 'express';
import { authenticate, authorize } from '../../middleware/auth.js';
import { validate } from '../../middleware/validate.js';
import { MODULES } from '../../config/permissions.js';
import { createFuelLogSchema, createExpenseSchema } from './expenses.schema.js';
import * as controller from './expenses.controller.js';

const router = Router();
router.use(authenticate);

router.get('/fuel', authorize(MODULES.EXPENSES, 'view'), controller.listFuel);
router.post('/fuel', authorize(MODULES.EXPENSES, 'edit'), validate(createFuelLogSchema), controller.createFuel);
router.get('/', authorize(MODULES.EXPENSES, 'view'), controller.listExpenses);
router.post('/', authorize(MODULES.EXPENSES, 'edit'), validate(createExpenseSchema), controller.createExpense);
router.get('/summary', authorize(MODULES.EXPENSES, 'view'), controller.summary);

export default router;
