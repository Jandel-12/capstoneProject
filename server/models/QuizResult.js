const mongoose = require('mongoose');

const quizResultSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  category: {
    type: String, // 'HTML', 'CSS', 'JavaScript'
    required: true
  },
  score: {
    type: Number,
    required: true
  },
  totalItems: {
    type: Number,
    required: true
  },
  passed: {
    type: Boolean,
    required: true
  },
  takenAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

module.exports = mongoose.model('QuizResult', quizResultSchema);
