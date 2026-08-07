const mongoose = require('mongoose');

const resumeVersionSchema = new mongoose.Schema({
  versionId: { type: String, required: true },
  title: { type: String, default: 'Software Engineer Resume' },
  content: { type: String, required: true },
  targetRole: { type: String, default: 'Full Stack Engineer' },
  atsScore: { type: Number, default: 85 },
  keywordsMatched: [{ type: String }],
  missingKeywords: [{ type: String }],
  formattingRating: { type: String, default: 'EXCELLENT' },
  createdAt: { type: Date, default: Date.now }
}, { _id: false });

const resumeSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true, 
    unique: true,
    index: true 
  },
  activeVersionId: { type: String, default: 'v1' },
  versions: [resumeVersionSchema],
  githubHandle: { type: String, default: 'vjkiran' },
  githubAnalysis: {
    publicRepos: { type: Number, default: 12 },
    totalStars: { type: Number, default: 45 },
    topLanguages: [{ type: String }],
    commitActivityScore: { type: Number, default: 92 },
    impactRating: { type: String, default: 'HIGH' }
  },
  jobReadinessScore: { type: Number, default: 88 },
  companyReadiness: [{
    companyName: { type: String, required: true },
    matchPercentage: { type: Number, required: true },
    status: { type: String, enum: ['READY', 'TARGETING', 'NEEDS_WORK'], default: 'TARGETING' }
  }],
  updatedAt: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.models.Resume || mongoose.model('Resume', resumeSchema);
