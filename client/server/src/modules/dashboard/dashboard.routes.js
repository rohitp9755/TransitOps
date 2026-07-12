import { Router } from 'express';
import { authenticate, authorize } from '../../middleware/auth.js';
import { MODULES } from '../../config/permissions.js';
import * as controller from './dashboard.controller.js';

const router = Router();
router.use(authenticate);
router.get('/', authorize(MODULES.DASHBOARD, 'view'), controller.summary);
export default router;
