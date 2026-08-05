const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./app/config/db');
const { errorHandler } = require('./app/middleware/error.middleware');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ limit: '50mb', extended: true }))
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Route files
const authRoutes = require('./app/routes/auth.routes');
const assessmentRoutes = require('./app/routes/assessment.routes');
const analyticsRoutes = require('./app/routes/analytics.routes');
const leaderboardRoutes = require('./app/routes/leaderboard.routes');
const chatRoutes = require('./app/routes/chat.routes');
const proctorRoutes = require('./app/routes/proctor.routes');

// Mount routers
app.use('/api/auth', authRoutes);
app.use('/api/assessments', assessmentRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/leaderboard', leaderboardRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/proctor', proctorRoutes);

// Base route
app.get('/', (req, res) => {
  res.status(200).json({ success: true, data: 'Welcome to Skill Trove API' });
});

// Error middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`);
  server.close(() => process.exit(1));
});
