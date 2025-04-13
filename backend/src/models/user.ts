import pool from '../config/database';
import logger from '../config/logger'; 

interface User {
  id: number;
  email: string;
  password: string;
}

class UserModel {
  static async findByEmail(email: string): Promise<User | undefined> {
    try {
      logger.info('Searching for user by email', { email });

      const query = 'SELECT * FROM users WHERE email = $1';
      const result = await pool.query<User>(query, [email]);

      if (result.rows.length > 0) {
        logger.info('User found', { userId: result.rows[0].id });
      } else {
        logger.warn('User not found', { email });
      }

      return result.rows[0];
    } catch (error: any) {
      logger.error('Error finding user by email', { email, error: error.message });
      throw error;
    }
  }

  static async create(email: string, password: string): Promise<User> {
    try {
      logger.info('Creating new user', { email });

      const query = 'INSERT INTO users (email, password) VALUES ($1, $2) RETURNING *';
      const values = [email, password];
      const result = await pool.query<User>(query, values);

      logger.info('User created successfully', { userId: result.rows[0].id });
      return result.rows[0];
    } catch (error: any) {
      logger.error('Error creating user', { email, error: error.message });
      throw error;
    }
  }
}

export default UserModel;
