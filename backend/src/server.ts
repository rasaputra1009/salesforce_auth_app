import express, { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import authRoutes from './routes/auth';
import salesforceRoutes from './routes/salesforce';
import cookieParser from 'cookie-parser';
import path from 'path';
import authenticateToken from './middleware/auth';
import logger from './config/logger';
import pool from './config/database';

dotenv.config();

const app = express();

// CORS configuration (dynamic for deployment)
const allowedOrigins = [process.env.NODE_ENV === 'development' ? 'http://localhost:8080' : process.env.FRONTEND_URL || ''];
app.use(cors({
  origin: allowedOrigins,
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

// Serve frontend build
app.use(express.static(path.join(__dirname, '../frontend/dist')));

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/salesforce', salesforceRoutes);

// Verify endpoint
const verifyRouter = express.Router();
verifyRouter.get('/verify', authenticateToken, (req: Request, res: Response) => {
  logger.info('GET /api/auth/verify called');
  res.json({ message: 'Token valid' });
});
app.use('/api/auth', verifyRouter);

// Global error handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  logger.error(`Global error: ${err.message}`, { stack: err.stack });
  res.status(500).json({ message: 'Something went wrong!', error: err.message });
});

// Catch-all route for undefined endpoints
app.use((req: Request, res: Response) => {
  logger.warn(`404 Not Found - ${req.method} ${req.originalUrl}`);
  res.status(404).json({ message: 'API endpoint not found' });
});

// Test DB connection endpoint
app.get('/api/test-db', async (req: Request, res: Response) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json({ message: 'Database connected', time: result.rows[0] });
  } catch (error) {
    logger.error('Database connection test failed', { error: (error as Error).message });
    res.status(500).json({ message: 'Database error', error: (error as Error).message });
  }
});

// Initialize database with users table
const initializeDatabase = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL
      );
    `);
    logger.info('Users table created or already exists');
  } catch (error) {
    logger.error('Failed to initialize database', { error: (error as Error).message });
  }
};

// Run initialization before starting the server
initializeDatabase().then(() => {
  const PORT = parseInt(process.env.PORT || '5000', 10);
  app.listen(PORT, () => logger.info(`🚀 Server running on port ${PORT}`));
});