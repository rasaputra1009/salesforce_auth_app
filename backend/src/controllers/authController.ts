import { Request, Response } from 'express';
import UserModel from '../models/user';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import logger from '../config/logger';

dotenv.config();

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    logger.info(`Register attempt for email: ${email}`);

    const user = await UserModel.findByEmail(email);
    if (user) {
      logger.warn(`Registration failed: User already exists for email ${email}`);
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await UserModel.create(email, hashedPassword);
    const token = jwt.sign(
      { id: newUser.id, email: newUser.email },
      process.env.JWT_SECRET as string,
      { expiresIn: '1h' }
    );

    logger.info(`User registered successfully: ${newUser.email}`);
    res.status(201).json({ token });
  } catch (error: any) {
    logger.error(`Error registering user: ${error.message}`);
    res.status(500).json({ message: 'Error registering user' });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    logger.info(`Login attempt for email: ${email}`);

    const user = await UserModel.findByEmail(email);
    if (!user) {
      logger.warn(`Login failed: No user found with email ${email}`);
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      logger.warn(`Login failed: Incorrect password for email ${email}`);
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET as string,
      { expiresIn: '1h' }
    );

    logger.info(`User logged in successfully: ${user.email}`);
    res.json({ token });
  } catch (error: any) {
    logger.error(`Error logging in: ${error.message}`);
    res.status(500).json({ message: 'Error logging in' });
  }
};

export const logout = async (req: Request, res: Response) => {
  try {
    logger.info('User logged out');
    res.json({ message: 'Logged out successfully' });
  } catch (error: any) {
    logger.error(`Error logging out: ${error.message}`);
    res.status(500).json({ message: 'Error logging out' });
  }
};
