import cors from 'cors';
import 'dotenv/config';
import express from 'express';
import { generalRateLimiter } from './middleware/rateLimiter.js';
import authRoutes from './routes/authRoutes.js';
import chatbotRoutes from './routes/chatRoutes.js';
import machineRoutes from './routes/machineRoutes.js';
import predictionRoutes from './routes/predictionRoutes.js';
import sensorRoutes from './routes/sensorRoutes.js';
import alertRoutes from './routes/alertRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';

const app = express();

// CORS configuration
const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:5173', 'http://localhost:3000'];
app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true
}));

// Body parser
app.use(express.json());

// Apply general rate limiter to all routes
app.use(generalRateLimiter);

const port = process.env.PORT || 3000;

// Root route
app.get('/', (req, res) => {
  res.json({
    message: 'Predictive Maintenance Backend API',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      auth: '/auth',
      machines: '/machines',
      sensors: '/sensor-data',
      predictions: '/predictions',
      chatbot: '/chatbot'
    },
    documentation: 'See API_TESTING_GUIDE.md for details'
  });
});

// Health check route
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'UP',
    timestamp: new Date().toISOString(),
    ml_services: {
      prediction: process.env.ML_PREDICT_URL,
      chatbot: process.env.ML_CHATBOT_URL
    },
    database: 'Connected'
  });
});

// API Routes
app.use('/auth', authRoutes);
app.use('/machines', machineRoutes);
app.use('/sensor-data', sensorRoutes);
app.use('/predictions', predictionRoutes);
app.use('/chatbot', chatbotRoutes);
app.use('/alerts', alertRoutes);
app.use('/dashboard', dashboardRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    status: 'error',
    message: 'Endpoint tidak ditemukan',
    path: req.path
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(err.status || 500).json({
    status: 'error',
    message: err.message || 'Terjadi kesalahan pada server',
    error: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

// Start server
app.listen(port, () => {
  console.log(`
╔═══════════════════════════════════════════════════════════╗
║  Predictive Maintenance Backend Server                   ║
╠═══════════════════════════════════════════════════════════╣
║  Server running at: http://localhost:${port}               ║
║  Environment: ${process.env.NODE_ENV || 'development'}                            ║
║                                                           ║
║  ML Services:                                             ║
║  - Prediction: ${process.env.ML_PREDICT_URL?.substring(0, 30)}... ║
║  - Chatbot:    ${process.env.ML_CHATBOT_URL?.substring(0, 30)}... ║
║                                                           ║
║  API Documentation: http://localhost:${port}/               ║
╚═══════════════════════════════════════════════════════════╝
  `);
});

// Graceful shutdown
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Promise Rejection:', err);
});

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  process.exit(1);
});