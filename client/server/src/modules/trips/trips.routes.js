import { Router } from 'express';
import { authenticate, authorize } from '../../middleware/auth.js';
import { validate } from '../../middleware/validate.js';
import { MODULES } from '../../config/permissions.js';
import { createTripSchema, scheduleTripSchema, completeTripSchema, listTripQuerySchema } from './trips.schema.js';
import * as controller from './trips.controller.js';

const router = Router();
router.use(authenticate);

router.get('/', authorize(MODULES.TRIPS, 'view'), validate(listTripQuerySchema, 'query'), controller.list);
router.get('/options', authorize(MODULES.TRIPS, 'edit'), controller.options);
router.get('/:id', authorize(MODULES.TRIPS, 'view'), controller.getOne);
router.post('/', authorize(MODULES.TRIPS, 'edit'), validate(createTripSchema), controller.create);
router.post('/:id/schedule', authorize(MODULES.TRIPS, 'edit'), validate(scheduleTripSchema), controller.schedule);
router.post('/:id/dispatch', authorize(MODULES.TRIPS, 'edit'), controller.dispatch);
router.post('/:id/start', authorize(MODULES.TRIPS, 'edit'), controller.start);
router.post('/:id/progress', authorize(MODULES.TRIPS, 'edit'), controller.progress);
router.post('/:id/complete', authorize(MODULES.TRIPS, 'edit'), validate(completeTripSchema), controller.complete);
router.post('/:id/cancel', authorize(MODULES.TRIPS, 'edit'), controller.cancel);

export default router;
