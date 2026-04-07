const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

// @route   POST /api/auth/register
router.post('/register', async (req, res) => {
  const { name, email, lrn, studentId, password } = req.body;

  try {
    // Check duplicates
    const existingEmail = await User.findOne({ email });
    if (existingEmail) return res.status(400).json({ message: 'Email already registered' });

    const existingLrn = await User.findOne({ lrn });
    if (existingLrn) return res.status(400).json({ message: 'LRN already registered' });
    

    const user = await User.create({ name, email, lrn, studentId, password });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      lrn: user.lrn,
      role: user.role,
      token: generateToken(user._id)
    });

  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// @route   POST /api/auth/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    if (!user.isActive) {
      return res.status(403).json({ message: 'Account has been deactivated' });
    }

    // 🆕 Block unapproved students
    if (user.role === 'student' && !user.isApproved) {
      return res.status(403).json({ message: 'Your account is pending admin approval.' });
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      lrn: user.lrn,
      studentId: user.studentId,
      role: user.role,
      token: generateToken(user._id)
    });

  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;