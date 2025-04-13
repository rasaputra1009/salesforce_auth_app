import express from 'express';
import { getSalesforceAccounts } from '../controllers/salesforceController';
import authenticateToken from '../middleware/auth';
import logger from '../config/logger'; 

const router = express.Router();

router.get('/accounts', authenticateToken, (req, res, next) => {
  logger.info('GET /salesforce/accounts called');
  getSalesforceAccounts(req, res).catch(next);
});

export default router;
