const mongoose = require('mongoose');

const moduleSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  icon: { type: String, default: '📝' },
  color: { type: String, default: 'blue' },
  locked: { type: Boolean, default: false },
  order: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Module', moduleSchema);