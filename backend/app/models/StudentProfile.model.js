const mongoose = require('mongoose');

const studentProfileSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true, 
    unique: true, 
    index: true 
  },
  bio: { type: String, default: 'Engineering Candidate & Scholar' },
  targetRole: { type: String, default: 'Full Stack Engineer' },
  studyGoals: [{ type: String }],
  preferredLanguage: { type: String, default: 'javascript' },
  
  preferences: {
    theme: { type: String, enum: ['light', 'dark', 'system'], default: 'light' },
    notificationsEnabled: { type: Boolean, default: true },
    proctoringStrictness: { type: String, enum: ['medium', 'strict', 'relaxed'], default: 'strict' }
  },

  statistics: {
    learning: {
      lessonsCompleted: { type: Number, default: 0 },
      totalStudyTimeMinutes: { type: Number, default: 0 },
      currentStreak: { type: Number, default: 0 },
      longestStreak: { type: Number, default: 0 }
    },
    practice: {
      totalQuizzes: { type: Number, default: 0 },
      totalQuestionsAttempted: { type: Number, default: 0 },
      averageAccuracyPercentage: { type: Number, default: 0 }
    },
    codelab: {
      problemsSolved: { type: Number, default: 0 },
      easySolved: { type: Number, default: 0 },
      mediumSolved: { type: Number, default: 0 },
      hardSolved: { type: Number, default: 0 },
      passRate: { type: Number, default: 0 }
    },
    interview: {
      mockInterviewsCompleted: { type: Number, default: 0 },
      avgInterviewScore: { type: Number, default: 0 },
      gazeStabilityAvg: { type: Number, default: 100 }
    },
    overallXp: { type: Number, default: 0 },
    rankLevel: { type: String, default: 'Scholar' }
  },

  achievements: [{
    badgeId: { type: String, required: true },
    name: { type: String, required: true },
    description: String,
    icon: String,
    unlockedAt: { type: Date, default: Date.now },
    category: { type: String, default: 'GENERAL' }
  }],

  aiMemory: {
    weakTopics: [{
      topic: { type: String, required: true },
      score: { type: Number, default: 0 },
      lastAssessedAt: { type: Date, default: Date.now }
    }],
    strongTopics: [{
      topic: { type: String, required: true },
      score: { type: Number, default: 100 }
    }],
    notes: [{ type: String }],
    learningPace: { type: String, enum: ['fast', 'moderate', 'steady'], default: 'moderate' },
    summaryContext: { type: String, default: 'Student is actively studying Data Structures and Algorithms.' }
  }
}, { timestamps: true });

module.exports = mongoose.models.StudentProfile || mongoose.model('StudentProfile', studentProfileSchema);
