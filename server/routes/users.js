const express = require('express');
const router = express.Router();

const User = require('../models/User');
const Progress = require('../models/Progress');
const QuizResult = require('../models/QuizResult');

const { protect, adminOnly } = require('../middleware/authMiddleware');


// =============================
// Helper: Delete user + relations
// =============================
async function deleteUserWithRelations(userId) {
  await Progress.deleteMany({ user: userId });
  await QuizResult.deleteMany({ user: userId });
  await User.findByIdAndDelete(userId);
}


// =============================
// GET ROUTES
// =============================
router.get('/', protect, adminOnly, async (req, res) => {
  try {
    const users = await User.find({
      role: 'student',
      isApproved: true
    }).select('-password');

    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/pending', protect, adminOnly, async (req, res) => {
  try {
    const users = await User.find({
      role: 'student',
      isApproved: false
    }).select('-password');

    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});


// =============================
// SPECIFIC PUT ROUTES (must come before /:id)
// =============================

// Approve student
router.put('/:id/approve', protect, adminOnly, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) return res.status(404).json({ message: 'User not found' });

    user.isApproved = true;
    await user.save();

    res.json({ message: 'Student approved successfully' });

  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});


// @route   PUT /api/users/:id/reset-password
// @desc    Admin resets a student's password
// @access  Admin only
router.put('/:id/reset-password', protect, adminOnly, async (req, res) => {
  const { newPassword } = req.body;

  if (!newPassword || newPassword.length < 8) {
    return res.status(400).json({ message: 'Password must be at least 8 characters' });
  }

  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.password = newPassword;
    await user.save(); // pre-save hook will hash it automatically

    res.json({ message: 'Password reset successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});


// Toggle active status
router.put('/:id/status', protect, adminOnly, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) return res.status(404).json({ message: 'User not found' });

    if (user.role === 'admin') {
      return res.status(403).json({ message: 'Cannot modify admin users' });
    }

    user.isActive = !user.isActive;
    await user.save();

    res.json({
      message: `User ${user.isActive ? 'activated' : 'deactivated'}`,
      isActive: user.isActive
    });

  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});


// =============================
// DELETE ROUTES
// =============================

// Reject student
router.delete('/:id/reject', protect, adminOnly, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) return res.status(404).json({ message: 'User not found' });

    if (user.role === 'admin') {
      return res.status(403).json({ message: 'Cannot delete admin users' });
    }

    await deleteUserWithRelations(req.params.id);

    res.json({ message: 'Student rejected and removed' });

  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});


// Delete user
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) return res.status(404).json({ message: 'User not found' });

    if (user.role === 'admin') {
      return res.status(403).json({ message: 'Cannot delete admin users' });
    }

    await deleteUserWithRelations(req.params.id);

    res.json({ message: 'User and associated data deleted' });

  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});


module.exports = router;