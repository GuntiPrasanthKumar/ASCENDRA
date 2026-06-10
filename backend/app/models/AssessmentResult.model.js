const mongoose = require('mongoose');

const assessmentResultSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  subject: { type: String, required: true },
  topic: { type: String, required: true },
  level: { type: String, required: true },
  score: { type: Number, required: true },
  totalQuestions: { type: Number, required: true },
  accuracy: { type: Number, required: true },
  strikes: { type: Number, default: 0 },
  details: [{
    question: String,
    userAnswer: String,
    correctAnswer: String,
    isCorrect: Boolean,
    explanation: String
  }],
  completedAt: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('AssessmentResult', assessmentResultSchema);
