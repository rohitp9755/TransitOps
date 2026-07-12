import { Router } from 'express';
import { authenticate, authorize } from '../../middleware/auth.js';
import { MODULES } from '../../config/permissions.js';
import * as controller from './analytics.controller.js';

const router = Router();
router.use(authenticate);
router.get('/', authorize(MODULES.ANALYTICS, 'view'), controller.summary);
router.get('/export', authorize(MODULES.ANALYTICS, 'view'), controller.exportCsv);
export default router;
