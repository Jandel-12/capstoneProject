const express = require('express');
const router = express.Router();
const Challenge = require('../models/Challenge');
const Module = require('../models/Module');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// @route   GET /api/challenges
// @desc    Get all modules with their challenges
// @access  Protected (logged in student)
router.get('/', protect, async (req, res) => {
  try {
    const modules = await Module.find().sort({ order: 1 });
    const challenges = await Challenge.find().sort({ order: 1 });

    // Group challenges by moduleId
    const grouped = {};
    modules.forEach(m => {
      grouped[m.id] = {
        module: m,
        challenges: []
      };
    });

    challenges.forEach(c => {
      if (grouped[c.moduleId]) {
        grouped[c.moduleId].challenges.push(c);
      }
    });

    res.json(grouped);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// @route   GET /api/challenges/modules
// @desc    Get all modules only
// @access  Protected
router.get('/modules', protect, async (req, res) => {
  try {
    const modules = await Module.find().sort({ order: 1 });
    res.json(modules);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// @route   GET /api/challenges/:moduleId
// @desc    Get challenges for a specific module
// @access  Protected
router.get('/:moduleId', protect, async (req, res) => {
  try {
    const challenges = await Challenge.find({ moduleId: req.params.moduleId }).sort({ order: 1 });
    res.json(challenges);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// @route   POST /api/challenges
// @desc    Create a new challenge
// @access  Admin only
router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const challenge = await Challenge.create(req.body);
    res.status(201).json(challenge);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// @route   PUT /api/challenges/:id
// @desc    Update a challenge
// @access  Admin only
router.put('/:id', protect, adminOnly, async (req, res) => {
  try {
    const challenge = await Challenge.findOneAndUpdate(
      { id: req.params.id },
      req.body,
      { new: true }
    );
    if (!challenge) return res.status(404).json({ message: 'Challenge not found' });
    res.json(challenge);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// @route   DELETE /api/challenges/:id
// @desc    Delete a challenge
// @access  Admin only
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    const challenge = await Challenge.findOneAndDelete({ id: req.params.id });
    if (!challenge) return res.status(404).json({ message: 'Challenge not found' });
    res.json({ message: 'Challenge deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// @route   POST /api/challenges/modules
// @desc    Create a new module
// @access  Admin only
router.post('/modules', protect, adminOnly, async (req, res) => {
  try {
    const module = await Module.create(req.body);
    res.status(201).json(module);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// @route   PUT /api/challenges/modules/:id
// @desc    Update a module
// @access  Admin only
router.put('/modules/:id', protect, adminOnly, async (req, res) => {
  try {
    const module = await Module.findOneAndUpdate(
      { id: req.params.id },
      req.body,
      { new: true }
    );
    if (!module) return res.status(404).json({ message: 'Module not found' });
    res.json(module);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;