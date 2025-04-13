import express from 'express';
import { register, login } from '../controllers/authController';
import logger from '../config/logger'; 

const router = express.Router();

router.post('/register', (req, res, next) => {
  logger.info('POST /auth/register called');
  register(req, res).catch(next); // catch for async errors
});

router.post('/login', (req, res, next) => {
  logger.info('POST /auth/login called');
  login(req, res).catch(next);
});

router.post('/logout', (req, res) => {
  logger.info('POST /auth/logout called');
  res.status(200).json({ message: 'Logged out successfully' });
});

export default router;
