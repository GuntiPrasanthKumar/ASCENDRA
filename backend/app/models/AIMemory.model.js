const mongoose = require('mongoose');

const aiMemorySchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true, 
    unique: true,
    index: true 
  },
  currentGoal: { 
    type: String, 
    default: 'Full Stack Software Engineer' 
  },
  targetCompany: { 
    type: String, 
    default: 'Tier 1 Tech' 
  },
  learningStyle: { 
    type: String, 
    enum: ['VISUAL', 'PRACTICAL', 'THEORETICAL', 'BALANCED'], 
    default: 'PRACTICAL' 
  },
  weakTopics: [{ 
    topic: String, 
    accuracy: Number, 
    lastAssessedAt: { type: Date, default: Date.now } 
  }],
  recurringMistakes: [{ 
    category: String, 
    description: String, 
    count: { type: Number, default: 1 } 
  }],
  resumeState: {
    atsScore: { type: Number, default: 75 },
    missingKeywords: [{ type: String }],
    lastAnalyzedAt: Date
  },
  interviewHistory: {
    averageScore: { type: Number, default: 82 },
    fillerWordRateWpm: { type: Number, default: 4 },
    recommendedFocus: { type: String, default: 'System Design & State Reduction' }
  },
  githubSync: {
    connectedRepoCount: { type: Number, default: 0 },
    primaryLanguages: [{ type: String }],
    lastSyncedAt: Date
  },
  activeProjects: [{
    title: String,
    status: String,
    techStack: [String]
  }]
}, { timestamps: true });

module.exports = mongoose.models.AIMemory || mongoose.model('AIMemory', aiMemorySchema);
