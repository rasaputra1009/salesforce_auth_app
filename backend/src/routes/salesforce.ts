import express from 'express';
import { getSalesforceAccounts } from '../controllers/salesforceController';
import authenticateToken from '../middleware/auth';

const router = express.Router();

router.get('/accounts', authenticateToken, getSalesforceAccounts);

export default router;