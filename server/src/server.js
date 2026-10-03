import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB, isDbConnected } from './config/db.js';

// Route Handlers
import movieRoutes from './routes/movieRoutes.js';
import authRoutes from './routes/authRoutes.js';
import theatreRoutes from './routes/theatreRoutes.js';
import showRoutes from './routes/showRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

// Load environment variables from .env
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(
  cors({
    origin: '*',
    credentials: true,
  })
);
app.use(express.json());

// Base Route
app.get('/', (req, res) => {
  res.json({
    message: '🎬 Welcome to CineBook Online Movie Ticket Booking Management API',
    version: '1.0.0',
    documentation: {
      health: '/api/health',
      auth: '/api/auth',
      movies: '/api/movies',
      theatres: '/api/theatres',
      shows: '/api/shows',
      bookings: '/api/bookings',
      admin: '/api/admin',
    },
  });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  const dbStatus = isDbConnected() ? 'connected' : 'disconnected';
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    database: {
      status: dbStatus,
      type: 'MongoDB',
    },
  });
});

// Mount API routes
app.use('/api/auth', authRoutes);
app.use('/api/movies', movieRoutes);
app.use('/api/theatres', theatreRoutes);
app.use('/api/shows', showRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/admin', adminRoutes);

// 404 Route Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `API route ${req.originalUrl} not found`,
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('[Server Error]', err.stack || err.message);
  res.status(err.statusCode || err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

// Start Express Server
app.listen(PORT, () => {
  console.log(`\n======================================================`);
  console.log(`  🎬 CineBook Server is running!`);
  console.log(`  🌐 Local:     http://localhost:${PORT}`);
  console.log(`  🩺 Health:    http://localhost:${PORT}/api/health`);
  console.log(`  🍿 Movies:    http://localhost:${PORT}/api/movies`);
  console.log(`  🏛️  Theatres:  http://localhost:${PORT}/api/theatres`);
  console.log(`  ⏰ Shows:     http://localhost:${PORT}/api/shows`);
  console.log(`  🎟️  Bookings:  http://localhost:${PORT}/api/bookings`);
  console.log(`======================================================\n`);
});
