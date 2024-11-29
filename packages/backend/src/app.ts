// packages/backend/src/app.ts
import express from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes';
import websiteRoutes from './routes/websiteRoutes';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/websites', websiteRoutes);

// Health Check Endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK' });
});

export default app;
