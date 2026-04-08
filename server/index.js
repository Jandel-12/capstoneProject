const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const progressRoutes = require('./routes/progress');
const resultRoutes = require('./routes/results');
const challengeRoutes = require('./routes/challenges');

const app = express();

// ====================== CORS ======================
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',
  'https://capstone-project-2hlxkhvcg-jandel-12s-projects.vercel.app',
  'https://capstone-project-1ijtnofkf-jandel-12s-projects.vercel.app',
  process.env.FRONTEND_URL
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log('🚫 Blocked origin:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
// =================================================

app.use(express.json());

// Serve Admin Panel (Important!)
app.use('/admin', express.static(path.join(__dirname, '../admin')));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/results', resultRoutes);
app.use('/api/challenges', challengeRoutes);

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'El Royale API is running',
    allowedOrigins: allowedOrigins 
  });
});

app.get('/', (req, res) => {
  res.json({ message: 'El Royale Backend is running!' });
});

// 404 Handler
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connected');
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`🌐 Allowed Origins:`, allowedOrigins);
    });
  })
  .catch(err => {
    console.error('❌ MongoDB connection error:', err);
  });