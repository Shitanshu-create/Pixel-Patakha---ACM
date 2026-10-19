import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import { clientUrl } from './config/env.js';
import apiRoutes from './routes/index.js';
import { notFound, errorHandler } from './middlewares/error.middleware.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// CORS configuration
const allowedOrigins = clientUrl === '*' ? ['*'] : clientUrl.split(',').map((url) => url.trim());

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes('*') || allowedOrigins.includes(origin) || origin.includes('localhost') || origin.includes('127.0.0.1')) {
        return callback(null, true);
      }
      return callback(new Error(`CORS policy: origin ${origin} is not allowed`));
    },
    credentials: true,
  })
);

// Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Root & Health Check routes (for Render, container health checks & uptime monitors)
app.get(['/', '/health'], (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
  res.status(200).json({
    status: 'ok',
    success: true,
    message: 'Pixel Patakha API server is running healthy',
    uptime: Math.round(process.uptime()),
    database: dbStatus,
    timestamp: new Date().toISOString(),
  });
});

// Mount API routes
app.use('/api', apiRoutes);

// Error handlers
app.use(notFound);
app.use(errorHandler);

export default app;
