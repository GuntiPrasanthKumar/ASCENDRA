const mongoose = require('mongoose');

const codeSubmissionSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true, 
    index: true 
  },
  problemId: { type: String, required: true, index: true },
  language: { type: String, required: true, default: 'javascript' },
  code: { type: String, required: true },
  verdict: { 
    type: String, 
    enum: ['ACCEPTED', 'WRONG_ANSWER', 'TIME_LIMIT_EXCEEDED', 'COMPILATION_ERROR', 'RUNTIME_ERROR', 'SECURITY_VIOLATION'],
    required: true,
    index: true
  },
  passCount: { type: Number, default: 0 },
  totalCount: { type: Number, default: 0 },
  executionTimeMs: { type: Number, default: 0 },
  memoryMb: { type: Number, default: 0 },
  aiReview: {
    cleanlinessScore: { type: Number, default: 90 },
    timeComplexity: { type: String, default: 'O(N)' },
    spaceComplexity: { type: String, default: 'O(1)' },
    summary: { type: String, default: '' },
    optimizations: [{ type: String }]
  },
  submittedAt: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.models.CodeSubmission || mongoose.model('CodeSubmission', codeSubmissionSchema);
