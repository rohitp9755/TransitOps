import { Router } from 'express';
import { authenticate, authorize } from '../../middleware/auth.js';
import { validate } from '../../middleware/validate.js';
import { MODULES } from '../../config/permissions.js';
import { updateSettingsSchema } from './settings.schema.js';
import * as controller from './settings.controller.js';

const router = Router();
router.use(authenticate);
// Any authenticated role may read settings (to view the RBAC grid);
// only roles with edit access to Settings can change org config.
router.get('/', controller.get);
router.patch('/', authorize(MODULES.SETTINGS, 'edit'), validate(updateSettingsSchema), controller.update);
export default router;
