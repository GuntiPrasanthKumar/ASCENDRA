const mongoose = require('mongoose');

const practiceRetryQueueSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true, 
    index: true 
  },
  questionText: { type: String, required: true },
  subject: { type: String, required: true, index: true },
  topic: { type: String, required: true, index: true },
  options: [{ type: String }],
  userAnswer: { type: String, default: '' },
  correctAnswer: { type: String, required: true },
  explanation: { type: String, default: '' },
  attemptCount: { type: Number, default: 1 },
  nextRetryDate: { type: Date, required: true, index: true },
  status: { 
    type: String, 
    enum: ['PENDING_RETRY', 'MASTERED'], 
    default: 'PENDING_RETRY',
    index: true 
  }
}, { timestamps: true });

module.exports = mongoose.models.PracticeRetryQueue || mongoose.model('PracticeRetryQueue', practiceRetryQueueSchema);
