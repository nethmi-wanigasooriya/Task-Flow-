const express = require('express');
const cors = require('cors');
require('dotenv').config();
const db = require('./config/db');

const app = express();

// Middlewares
app.use(cors({
  origin: 'http://localhost:3000', // Frontend origin allow කිරීම
  credentials: true
}));
app.use(express.json());

// Incoming Request Logger 
app.use((req, res, next) => {
  console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${req.url}`);
  next();
});

// Root Health Check Route
app.get('/', (req, res) => {
  res.json({ message: 'TaskFlow Engine Backend API is running smoothly!' });
});

// Routes Mounting
const authRoutes = require('./routes/authRoutes');
const taskRoutes = require('./routes/taskRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

// Global Error Handling Middleware
app.use((err, req, res, next) => {
  console.error('❌ Server Internal Error:', err.stack);
  res.status(500).json({ message: 'Internal Server Error', error: err.message });
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});