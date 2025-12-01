import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import machineRoutes from './routes/machineRoutes.js';
import sensorRoutes from './routes/sensorRoutes.js';
import predictionRoutes from './routes/predictionRoutes.js'
import authRoutes from './routes/authRoutes.js';

const app = express();
app.use(cors());
app.use(express.json());

// Env port or 3000
const port = process.env.PORT || 3000;

// Root route
app.get('/', (req, res) => {
  res.send('Hello World! Ini adalah BE Predictive Maintenance Copilot.');
});

// Health route
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'UP' });
});

// Auth route
app.use('/auth', authRoutes);

// Machine route
app.use('/machines', machineRoutes);

app.use('/sensor-data', sensorRoutes);

app.use('/predictions', predictionRoutes)

// Start server
app.listen(port, () => {
  console.log(`Server BE berjalan di http://localhost:${port}`);
});