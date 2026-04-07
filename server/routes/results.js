const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// @route   GET /api/users
// @desc    Get all approved students
// @access  Admin only
router.get('/', protect, adminOnly, async (req, res) => {
  try {
    const users = await User.find({ role: 'student', isApproved: true }).select('-password');
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// 🆕 @route   GET /api/users/pending
// @desc    Get all pending students
// @access  Admin only
router.get('/pending', protect, adminOnly, async (req, res) => {
  try {
    const users = await User.find({ role: 'student', isApproved: false }).select('-password');
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// 🆕 @route   PUT /api/users/:id/approve
// @desc    Approve a student
// @access  Admin only
router.put('/:id/approve', protect, adminOnly, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.isApproved = true;
    await user.save();

    res.json({ message: 'Student approved successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// 🆕 @route   DELETE /api/users/:id/reject
// @desc    Reject and delete a pending student
// @access  Admin only
router.delete('/:id/reject', protect, adminOnly, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    await user.deleteOne();
    res.json({ message: 'Student rejected and removed' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// @route   PUT /api/users/:id/toggle
// @desc    Activate or deactivate a student
// @access  Admin only
router.put('/:id/toggle', protect, adminOnly, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.isActive = !user.isActive;
    await user.save();

    res.json({ message: `User ${user.isActive ? 'activated' : 'deactivated'}`, isActive: user.isActive });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// @route   DELETE /api/users/:id
// @desc    Delete a student
// @access  Admin only
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    await user.deleteOne();
    res.json({ message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;