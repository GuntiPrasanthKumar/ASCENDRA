const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  id: { type: String, required: true },
  text: { type: String, required: true },
  options: [{ type: String }],
  correctIdx: { type: Number, required: true },
  explanation: { type: String, default: '' },
  difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard', 'Pro'], default: 'Medium' },
  bloomsLevel: { type: String, enum: ['Remember', 'Understand', 'Apply', 'Analyze', 'Evaluate', 'Create'], default: 'Understand' },
  points: { type: Number, default: 10 }
});

const sectionSchema = new mongoose.Schema({
  sectionId: { type: String, required: true },
  title: { type: String, required: true },
  timeLimitMinutes: { type: Number, default: 15 },
  questions: [questionSchema]
});

const assessmentSessionSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true, 
    index: true 
  },
  subject: { type: String, required: true },
  topic: { type: String, required: true },
  status: { 
    type: String, 
    enum: ['DRAFT', 'SCHEDULED', 'ACTIVE', 'PAUSED', 'SUBMITTED', 'EXPIRED', 'EVALUATED'], 
    default: 'ACTIVE',
    index: true 
  },
  sections: [sectionSchema],
  answers: { 
    type: Map, 
    of: new mongoose.Schema({
      userAnswer: String,
      selectedIdx: Number,
      timeSpentSeconds: { type: Number, default: 0 },
      confidence: { type: String, enum: ['LOW', 'MEDIUM', 'HIGH'], default: 'MEDIUM' },
      autosavedAt: { type: Date, default: Date.now }
    }, { _id: false }),
    default: {}
  },
  seed: { type: Number, required: true },
  timeLimitMinutes: { type: Number, default: 20 },
  startedAt: { type: Date, default: Date.now, required: true },
  expiresAt: { type: Date, required: true, index: true },
  autoSavedAt: { type: Date, default: Date.now },
  completedAt: { type: Date, default: null },
  
  proctoringData: {
    strikes: { type: Number, default: 0 },
    gazeStabilityAvg: { type: Number, default: 100 },
    integrityScore: { type: Number, default: 100 },
    isFlagged: { type: Boolean, default: false }
  },

  evaluation: {
    totalQuestions: { type: Number, default: 0 },
    correctAnswers: { type: Number, default: 0 },
    incorrectAnswers: { type: Number, default: 0 },
    unanswered: { type: Number, default: 0 },
    rawScore: { type: Number, default: 0 },
    negativeDeductions: { type: Number, default: 0 },
    finalScore: { type: Number, default: 0 },
    accuracyPercentage: { type: Number, default: 0 }
  },

  aiFeedback: {
    summary: { type: String, default: '' },
    strengths: [{ type: String }],
    weaknesses: [{ type: String }],
    recommendations: [{ type: String }]
  }
}, { timestamps: true });

// Prevent duplicate active assessments for the same user and topic
assessmentSessionSchema.index({ userId: 1, topic: 1, status: 1 });

module.exports = mongoose.models.AssessmentSession || mongoose.model('AssessmentSession', assessmentSessionSchema);
