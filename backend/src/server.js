import express from 'express';

const app = express();

// Env port or 3000
const port = process.env.PORT || 3000;

// Root route
app.get('/', (req, res) => {
  res.send('Hello World! HIHIHIHA!');
});

// Health route
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'UP' });
});

// Start server
app.listen(port, () => {
  console.log(`Server BE berjalan di http://localhost:${port}`);
});