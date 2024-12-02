// packages/backend/src/controllers/authController.ts
import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { createUser, findUserByEmail, deleteUserById, findUserById } from '../models/userModel';

dotenv.config();

export const register = async (req: Request, res: Response): Promise<any> => {
  const { email, password } = req.body;
  try {
    const existingUser = await findUserByEmail(email);
    if (existingUser)
      return res.status(400).json({ message: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await createUser(email, hashedPassword);
    
    // Create token for automatic login
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, {
      expiresIn: '1h',
    });

    res.status(201).json({ 
      message: 'User registered successfully',
      token 
    });
  } catch (error) {
    console.error('Registration Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const login = async (req: Request, res: Response):Promise<any> => {
  const { email, password } = req.body;
  try {
    const user = await findUserByEmail(email);
    if (!user)
      return res.status(401).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, {
      expiresIn: '1h',
    });

    res.json({ token });
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const deleteAccount = async (req: Request, res: Response): Promise<any> => {
  try {
    const userId = (req as any).user;
    console.log('Attempting to delete user with ID:', userId);

    // First check if user exists
    const user = await findUserById(userId);
    if (!user) {
      console.error('User not found:', userId);
      return res.status(404).json({ message: 'User not found' });
    }

    await deleteUserById(userId);
    res.json({ message: 'Account successfully deleted' });
  } catch (error) {
    console.error('Delete Account Error:', {
      error,
      userId: (req as any).user,
      headers: req.headers
    });
    res.status(500).json({ message: 'Failed to delete account' });
  }
};
