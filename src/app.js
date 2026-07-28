import express from 'express';
import cors from 'cors';
import helmet from 'helmet';

import { requestLogger } from './middleware/requestLogger.js';
import { errorHandler } from './middleware/errorHandler.js';
import { rateLimiter } from './middleware/rateLimiter.js';

import authRoutes from './modules/auth/auth.routes.js';
import usersRoutes from './modules/users/users.routes.js';
import rolesRoutes from './modules/roles/roles.routes.js';
import addressesRoutes from './modules/addresses/addresses.routes.js';
import catalogueRoutes from './modules/catalogue/catalogue.routes.js';
import searchRoutes from './modules/search/search.routes.js';
import cartRoutes from './modules/cart/cart.routes.js';
import promotionsRoutes from './modules/promotions/promotions.routes.js';
import checkoutRoutes from './modules/checkout/checkout.routes.js';
import paymentsRoutes from './modules/payments/payments.routes.js';
import ordersRoutes from './modules/orders/orders.routes.js';
import returnsRoutes from './modules/returns/returns.routes.js';
import notificationsRoutes from './modules/notifications/notifications.routes.js';
import adminRoutes from './modules/admin/admin.routes.js';

export function createApp() {
  const app = express();

  // Core middleware
  app.use(helmet());
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(requestLogger);
  app.use(rateLimiter);

  // Health check
  app.get('/health', (_req, res) => {
    res.status(200).json({ status: 'ok' });
  });

  // Module routers
  app.use('/auth', authRoutes);
  app.use('/users', usersRoutes);
  app.use('/roles', rolesRoutes);
  app.use('/users', addressesRoutes);
  app.use('/catalogue', catalogueRoutes);
  app.use('/', searchRoutes);
  app.use('/carts', cartRoutes);
  app.use('/', promotionsRoutes);
  app.use('/checkout', checkoutRoutes);
  app.use('/payments', paymentsRoutes);
  app.use('/orders', ordersRoutes);
  app.use('/', returnsRoutes);
  app.use('/notifications', notificationsRoutes);
  app.use('/admin', adminRoutes);

  // Error handler — must be last
  app.use(errorHandler);

  return app;
}
