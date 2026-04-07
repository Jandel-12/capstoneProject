const express = require('express');
const router = express.Router();
const Progress = require('../models/Progress');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// @route   GET /api/progress
// @desc    Get all students' progress
// @access  Admin only
router.get('/', protect, adminOnly, async (req, res) => {
  try {
    const progress = await Progress.find()
      .populate('user', 'name email')
      .sort({ completedAt: -1 });
    res.json(progress);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// @route   GET /api/progress/mine   ← 🔧 MOVED UP before /:userId
// @desc    Get logged-in student's own progress
// @access  Protected (student)
router.get('/mine', protect, async (req, res) => {
  try {
    const progress = await Progress.find({ user: req.user._id });
    res.json(progress);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// @route   GET /api/progress/:userId
// @desc    Get one student's progress
// @access  Admin only
router.get('/:userId', protect, adminOnly, async (req, res) => {
  try {
    const progress = await Progress.find({ user: req.params.userId })
      .populate('user', 'name email');
    res.json(progress);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// @route   POST /api/progress
// @desc    Save student progress (called from frontend)
// @access  Protected (logged in student)
router.post('/', protect, async (req, res) => {
  const { challengeId, challengeTitle, category, completed } = req.body;

  try {
    const existing = await Progress.findOne({ user: req.user._id, challengeId });

    if (existing) {
      existing.completed = completed;
      existing.completedAt = completed ? new Date() : null;
      await existing.save();
      return res.json(existing);
    }

    const progress = await Progress.create({
      user: req.user._id,
      challengeId,
      challengeTitle,
      category,
      completed,
      completedAt: completed ? new Date() : null
    });

    res.status(201).json(progress);
  } catch (err) {
    console.error('Progress save error:', err.message);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;