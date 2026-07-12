import { Router } from 'express';
import authRoutes from './modules/auth/auth.routes.js';
import vehicleRoutes from './modules/vehicles/vehicles.routes.js';
import driverRoutes from './modules/drivers/drivers.routes.js';
import tripRoutes from './modules/trips/trips.routes.js';
import maintenanceRoutes from './modules/maintenance/maintenance.routes.js';
import expenseRoutes from './modules/expenses/expenses.routes.js';
import dashboardRoutes from './modules/dashboard/dashboard.routes.js';
import analyticsRoutes from './modules/analytics/analytics.routes.js';
import settingsRoutes from './modules/settings/settings.routes.js';

/** Single place that mounts every domain module under /api. */
export const apiRouter = Router();

apiRouter.get('/health', (req, res) => res.json({ status: 'ok', service: 'transitops-api' }));
apiRouter.use('/auth', authRoutes);
apiRouter.use('/vehicles', vehicleRoutes);
apiRouter.use('/drivers', driverRoutes);
apiRouter.use('/trips', tripRoutes);
apiRouter.use('/maintenance', maintenanceRoutes);
apiRouter.use('/expenses', expenseRoutes);
apiRouter.use('/dashboard', dashboardRoutes);
apiRouter.use('/analytics', analyticsRoutes);
apiRouter.use('/settings', settingsRoutes);
