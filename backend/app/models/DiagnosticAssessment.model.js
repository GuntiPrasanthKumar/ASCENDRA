const mongoose = require('mongoose');

const diagnosticAssessmentSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true, 
    index: true 
  },
  domain: { type: String, required: true, index: true },
  totalQuestions: { type: Number, default: 10 },
  currentQuestionIndex: { type: Number, default: 0 },
  currentDifficulty: { type: String, enum: ['Easy', 'Medium', 'Hard', 'Pro'], default: 'Medium' },
  questions: [{
    questionId: String,
    questionText: String,
    options: [String],
    correctOptionIndex: Number,
    bloomsLevel: String,
    difficulty: String,
    explanation: String,
    userAnswerIndex: Number,
    isCorrect: Boolean,
    timeSpentSeconds: Number
  }],
  status: { type: String, enum: ['IN_PROGRESS', 'COMPLETED'], default: 'IN_PROGRESS' },
  score: { type: Number, default: 0 },
  accuracyPercentage: { type: Number, default: 0 },
  assignedSkillLevel: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced'], default: 'Beginner' },
  identifiedWeakTopics: [{ type: String }],
  completedAt: Date
}, { timestamps: true });

module.exports = mongoose.models.DiagnosticAssessment || mongoose.model('DiagnosticAssessment', diagnosticAssessmentSchema);
