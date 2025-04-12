import express from 'express';
import { getAccounts } from '../controllers/salesforceController';
import authenticateToken from '../middleware/auth';

const router = express.Router();

router.get('/accounts', authenticateToken, getAccounts);

export default router;