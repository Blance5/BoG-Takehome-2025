import express, { Application, Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './src/server/db/mongo.js';
import requestRoutes from './src/server/routes/requestRoutes.js';

// Load environment variables
dotenv.config();

// Initialize Express app
const app: Application = express();
const PORT: number = parseInt(process.env.PORT || '5000', 10);

// Middleware
app.use(cors({
  origin: 'http://localhost:3000', // Your Next.js frontend URL
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  credentials: true
}));
app.use(express.json());

// MongoDB Connection
connectDB();

// Routes
app.use('/api/request', requestRoutes);

// Global error handler (optional, recommended for API apps)
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
