const mongoose = require('mongoose');

const questionEvalSchema = new mongoose.Schema({
  questionId: { type: String, required: true },
  questionText: { type: String, required: true },
  candidateTranscript: { type: String, default: '' },
  wpm: { type: Number, default: 130 },
  fillerWords: [{ type: String }],
  technicalScore: { type: Number, default: 85 },
  communicationScore: { type: Number, default: 85 },
  strengths: [{ type: String }],
  gaps: [{ type: String }],
  idealAnswerSnippet: { type: String, default: '' }
}, { _id: false });

const interviewResultSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true, 
    index: true 
  },
  interviewId: { type: String, required: true, index: true },
  title: { type: String, required: true },
  category: { type: String, default: 'General' },
  overallScore: { type: Number, required: true, min: 0, max: 100 },
  communicationScore: { type: Number, required: true, min: 0, max: 100 },
  technicalScore: { type: Number, required: true, min: 0, max: 100 },
  problemSolvingScore: { type: Number, required: true, min: 0, max: 100 },
  readinessScore: { type: Number, required: true, min: 0, max: 100 },
  readinessBadge: { type: String, enum: ['TIER_1_READY', 'INDUSTRY_READY', 'DEVELOPING'], default: 'INDUSTRY_READY' },
  strengths: [{ type: String }],
  weaknesses: [{ type: String }],
  recommendations: [{ type: String }],
  questionEvaluations: [questionEvalSchema],
  completedAt: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.models.InterviewResult || mongoose.model('InterviewResult', interviewResultSchema);
