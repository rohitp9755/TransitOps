import { Router } from 'express';
import { authenticate, authorize } from '../../middleware/auth.js';
import { validate } from '../../middleware/validate.js';
import { MODULES } from '../../config/permissions.js';
import { createVehicleSchema, updateVehicleSchema, listVehicleQuerySchema } from './vehicles.schema.js';
import * as controller from './vehicles.controller.js';

const router = Router();
router.use(authenticate);

router.get('/', authorize(MODULES.FLEET, 'view'), validate(listVehicleQuerySchema, 'query'), controller.list);
router.get('/:id', authorize(MODULES.FLEET, 'view'), controller.getOne);
router.post('/', authorize(MODULES.FLEET, 'edit'), validate(createVehicleSchema), controller.create);
router.patch('/:id', authorize(MODULES.FLEET, 'edit'), validate(updateVehicleSchema), controller.update);
router.delete('/:id', authorize(MODULES.FLEET, 'edit'), controller.remove);

export default router;
