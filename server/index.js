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


const corsOptions = {
  origin: [
    'http://localhost:3000',
    'https://el-royale-platform.vercel.app'
  ],
  credentials: true
};

app.use(cors(corsOptions));
app.use(express.json());

app.use('/admin', express.static(path.join(__dirname, '../admin')));

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/results', resultRoutes);
app.use('/api/challenges', challengeRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'El Royale API is running!' });
});

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connected');
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err);
  });