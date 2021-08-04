import express from 'express';

import AuthController from '../controllers/AuthController';
import { validateRegister } from '../middleware/validation';

const createRoutes = (app: express.Express) => {
  app.post('/api/register', validateRegister, AuthController.register);
  app.post('/api/activate', AuthController.activateAccount);
  app.post('/api/login', AuthController.login);
  app.get('/api/logout', AuthController.logout);
  app.get('/api/refresh_token', AuthController.refreshToken);
  app.post('/api/login_sms', AuthController.loginSMS);
  app.post('/api/sms_verify', AuthController.smsVerify);
};

export default createRoutes;
