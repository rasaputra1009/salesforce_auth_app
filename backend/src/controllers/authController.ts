import { Request, Response } from 'express';
import UserModel from '../models/user';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
dotenv.config();

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await UserModel.findByEmail(email);
    if (user) return res.status(400).json({ message: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await UserModel.create(email, hashedPassword);
    const token = jwt.sign(
      { id: newUser.id, email: newUser.email },
      process.env.JWT_SECRET as string,
      { expiresIn: '1h' }
    );
    res.status(201).json({ token });
  } catch (error) {
    res.status(500).json({ message: 'Error registering user' });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await UserModel.findByEmail(email);
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET as string,
      { expiresIn: '1h' }
    );
    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: 'Error logging in' });
  }
};

// Logout endpoint (clears token on frontend side)
export const logout = async (req: Request, res: Response) => {
  try {
    res.json({ message: 'Logged out successfully' }); // Frontend will clear localStorage
  } catch (error) {
    res.status(500).json({ message: 'Error logging out' });
  }
};