import { Router } from 'express';
import { authenticate, authorize } from '../../middleware/auth.js';
import { validate } from '../../middleware/validate.js';
import { MODULES } from '../../config/permissions.js';
import { createDriverSchema, updateDriverSchema, listDriverQuerySchema } from './drivers.schema.js';
import * as controller from './drivers.controller.js';

const router = Router();
router.use(authenticate);

router.get('/', authorize(MODULES.DRIVERS, 'view'), validate(listDriverQuerySchema, 'query'), controller.list);
router.get('/:id', authorize(MODULES.DRIVERS, 'view'), controller.getOne);
router.post('/', authorize(MODULES.DRIVERS, 'edit'), validate(createDriverSchema), controller.create);
router.patch('/:id', authorize(MODULES.DRIVERS, 'edit'), validate(updateDriverSchema), controller.update);
router.delete('/:id', authorize(MODULES.DRIVERS, 'edit'), controller.remove);

export default router;
