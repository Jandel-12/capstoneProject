// server/index.js 

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const progressRoutes = require('./routes/progress');
const resultRoutes = require('./routes/results');
const challengeRoutes = require('./routes/challenges');

const app = express();

// ====================== IMPROVED CORS ======================
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',
  'https://capstone-project-2hlxkhvcg-jandel-12s-projects.vercel.app',
  'https://capstone-project-1ijtnofkf-jandel-12s-projects.vercel.app',   // ← New one
  process.env.FRONTEND_URL
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.log('Blocked origin:', origin); // Helpful for debugging
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
// =========================================================

app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/results', resultRoutes);
app.use('/api/challenges', challengeRoutes);

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    allowedOrigins: allowedOrigins 
  });
});

app.get('/', (req, res) => res.json({ message: 'El Royale API Running' }));

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connected');
    app.listen(PORT, () => console.log(`🚀 Server on port ${PORT}`));
  })
  .catch(err => console.error('MongoDB Error:', err));