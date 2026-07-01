require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const db = require('./config/database.js');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Import Router Modules
const authRoutes = require('./routes/auth.js');
const bookingRoutes = require('./routes/bookings.js');
const assignmentRoutes = require('./routes/assignments.js');
const reportRoutes = require('./routes/reports.js');
const userRoutes = require('./routes/users.js');

// Register API Routes
app.use('/api/auth', authRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/assignments', assignmentRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/users', userRoutes);

// Simple status route
app.get('/api/health', (req, res) => {
  res.json({ status: 'healthy', database: 'connected', timestamp: new Date() });
});

// Serve Frontend Static Files in Production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../../frontend/dist')));
  
  app.get(/(.*)/, (req, res) => {
    res.sendFile(path.join(__dirname, '../../frontend/dist/index.html'));
  });
} else {
  app.get('/', (req, res) => {
    res.send('BinUthman Water Delivery API is running in Development mode.');
  });
}

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled Error:', err.stack);
  res.status(500).json({
    message: 'Something went wrong on the server',
    error: process.env.NODE_ENV === 'development' ? err.message : {}
  });
});

// Start Server
if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Healthcheck URL: http://localhost:${PORT}/api/health`);
  });
}

module.exports = app;

