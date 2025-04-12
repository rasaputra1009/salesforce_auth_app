import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import authRoutes from './routes/auth';
import salesforceRoutes from './routes/salesforce';
import cookieParser from 'cookie-parser';
import authenticateToken from './middleware/auth';

dotenv.config();

const app = express();
app.use(cors()); // No credentials needed for localStorage
app.use(express.json());
app.use(cookieParser()); // Optional, can be removed if not using cookies

app.use('/api/auth', authRoutes);
app.use('/api/salesforce', authenticateToken, salesforceRoutes);

const PORT = parseInt(process.env.PORT || '5000', 10);
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));