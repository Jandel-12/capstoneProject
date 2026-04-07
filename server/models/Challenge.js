// server/models/Challenge.js
const mongoose = require('mongoose');

const validationRuleSchema = new mongoose.Schema({
  // Type of validation rule
  type: {
    type: String,
    required: true,
    enum: ['exists', 'textContent', 'attribute', 'count'], // extend as needed
  },

  // CSS selector (e.g., 'h1', 'button.submit', 'input[type="text"]')
  selector: {
    type: String,
    required: true,
  },

  // Expected value (used differently based on 'type')
  expected: {
    type: String,
    default: null,
  },

  // Custom error message
  message: {
    type: String,
    required: true,
  },

  // Optional fields for more advanced rules
  attribute: { type: String },        // e.g., for attribute rules
  minCount: { type: Number },         // for count rules
  exactCount: { type: Number },
}, { _id: false });   // No _id for subdocuments

const challengeSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    uppercase: true,        // optional: makes "html-1" consistent
  },

  moduleId: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
  },

  title: {
    type: String,
    required: true,
    trim: true,
  },

  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    required: true,
  },

  type: {
    type: String,
    enum: ['html', 'css', 'javascript'],
    default: 'html',
    required: true,
  },

  instructions: {
    type: String,
    required: true,
  },

  starterCode: {
    type: String,
    default: '',
  },

  hints: [{
    type: String,
    trim: true,
  }],

  // Validation rules array
  validation: [validationRuleSchema],

  order: {
    type: Number,
    default: 0,
  },
}, { 
  timestamps: true 
});

// Optional: Custom validation for the validation array
challengeSchema.path('validation').validate(function(rules) {
  if (!rules || rules.length === 0) return true;
  return rules.every(rule => {
    return rule.type && rule.selector && rule.message;
  });
}, 'Each validation rule must have type, selector, and message.');

module.exports = mongoose.model('Challenge', challengeSchema);