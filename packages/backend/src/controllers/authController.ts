// packages/backend/src/controllers/authController.ts
import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { createUser, findUserByEmail } from '../models/userModel';

dotenv.config();

export const register = async (req: Request, res: Response): Promise<any> => {
  const { email, password } = req.body;
  try {
    const existingUser = await findUserByEmail(email);
    if (existingUser)
      return res.status(400).json({ message: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await createUser(email, hashedPassword);
    res.status(201).json({ message: 'User registered successfully' });
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
