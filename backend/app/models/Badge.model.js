const mongoose = require('mongoose');

const BadgeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a badge name']
  },
  description: {
    type: String,
    required: [true, 'Please add a description']
  },
  icon: {
    type: String, // emoji or URL
    required: [true, 'Please add an icon']
  },
  criteria: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Badge', BadgeSchema);
