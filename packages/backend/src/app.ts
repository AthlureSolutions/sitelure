// packages/backend/src/app.ts
import express from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes';
import websiteRoutes from './routes/websiteRoutes';

const app = express();

// Configure CORS with specific origin
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: false,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept']
}));

app.use(express.json());

app.use('/auth', authRoutes);
app.use('/websites', websiteRoutes);

// Health Check Endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK' });
});

export default app;
