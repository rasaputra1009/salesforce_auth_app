import pool from '../config/database';

interface User {
  id: number;
  email: string;
  password: string;
}

class UserModel {
  static async findByEmail(email: string): Promise<User | undefined> {
    console.log('Finding user with email:', email);
    const query = 'SELECT * FROM users WHERE email = $1';
    const result = await pool.query<User>(query, [email]);
    return result.rows[0];
  }

  static async create(email: string, password: string): Promise<User> {
    console.log('Creating user with email:', email, 'and password:', password);
    const query = 'INSERT INTO users (email, password) VALUES ($1, $2) RETURNING *';
    const values = [email, password];
    const result = await pool.query<User>(query, values);
    return result.rows[0];
  }
}

export default UserModel;