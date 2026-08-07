const mongoose = require('mongoose');

const journeyActivitySchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true, 
    index: true 
  },
  module: { 
    type: String, 
    enum: ['LEARNING', 'PRACTICE', 'CODELAB', 'INTERVIEW', 'ACHIEVEMENT', 'AUTH'], 
    required: true,
    index: true
  },
  action: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, default: '' },
  xpEarned: { type: Number, default: 0 },
  metadata: { type: mongoose.Schema.Types.Mixed, default: {} },
  createdAt: { type: Date, default: Date.now, index: true }
}, { timestamps: true });

module.exports = mongoose.models.JourneyActivity || mongoose.model('JourneyActivity', journeyActivitySchema);
