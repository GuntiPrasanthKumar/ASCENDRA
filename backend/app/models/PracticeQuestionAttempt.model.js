const mongoose = require('mongoose');

const practiceQuestionAttemptSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true, 
    index: true 
  },
  assessmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'AssessmentResult', index: true },
  subject: { type: String, required: true },
  topic: { type: String, required: true },
  questionText: { type: String, required: true },
  userAnswer: { type: String, required: true },
  correctAnswer: { type: String, required: true },
  isCorrect: { type: Boolean, required: true },
  confidence: { 
    type: String, 
    enum: ['LOW', 'MEDIUM', 'HIGH'], 
    default: 'MEDIUM' 
  },
  difficulty: { 
    type: String, 
    enum: ['Easy', 'Medium', 'Hard', 'Pro'], 
    default: 'Medium' 
  },
  timeSpentSeconds: { type: Number, default: 0 }
}, { timestamps: true });

// Prevent duplicate question submission within the same assessment
practiceQuestionAttemptSchema.index({ userId: 1, assessmentId: 1, questionText: 1 }, { unique: true });

module.exports = mongoose.models.PracticeQuestionAttempt || mongoose.model('PracticeQuestionAttempt', practiceQuestionAttemptSchema);
