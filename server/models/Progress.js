const mongoose = require('mongoose');

const progressSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  challengeId: {
    type: String,
    required: true
  },
  challengeTitle: {
    type: String
  },
  category: {
    type: String, // 'HTML', 'CSS', 'JavaScript'
  },
  completed: {
    type: Boolean,
    default: false
  },
  completedAt: {
    type: Date
  }
}, { timestamps: true });

module.exports = mongoose.model('Progress', progressSchema);