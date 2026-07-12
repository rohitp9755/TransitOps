import { Router } from 'express';
import { authenticate, authorize } from '../../middleware/auth.js';
import { validate } from '../../middleware/validate.js';
import { MODULES } from '../../config/permissions.js';
import { createMaintenanceSchema, listMaintenanceQuerySchema } from './maintenance.schema.js';
import * as controller from './maintenance.controller.js';

const router = Router();
router.use(authenticate);

router.get('/', authorize(MODULES.MAINTENANCE, 'view'), validate(listMaintenanceQuerySchema, 'query'), controller.list);
router.post('/', authorize(MODULES.MAINTENANCE, 'edit'), validate(createMaintenanceSchema), controller.create);
router.post('/:id/close', authorize(MODULES.MAINTENANCE, 'edit'), controller.close);

export default router;
