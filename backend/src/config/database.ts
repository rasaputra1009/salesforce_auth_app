import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const isProduction = process.env.NODE_ENV === 'production';
const connectionString = isProduction
  ? process.env.DATABASE_URL
  : `postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT || 5432}/${process.env.DB_NAME}`;

const pool = new Pool({
  connectionString,
  ssl: isProduction ? { rejectUnauthorized: false } : undefined,
});

export default pool;