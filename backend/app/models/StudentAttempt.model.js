const mongoose = require('mongoose');

const StudentAttemptSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  assessment: {
    type: mongoose.Schema.ObjectId,
    ref: 'Assessment',
    required: true
  },
  score: {
    type: Number,
    required: true
  },
  maxScore: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['in-progress', 'completed', 'terminated'],
    default: 'completed'
  },
  answers: [{
    questionIndex: {
      type: Number,
      required: true
    },
    selectedOptionIndex: {
      type: Number
    },
    isCorrect: {
      type: Boolean,
      required: true
    }
  }],
  startedAt: {
    type: Date,
    default: Date.now
  },
  completedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('StudentAttempt', StudentAttemptSchema);
