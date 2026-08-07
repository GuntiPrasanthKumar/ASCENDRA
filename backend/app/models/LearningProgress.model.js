const mongoose = require('mongoose');

const learningProgressSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true, 
    index: true 
  },
  subjectId: { type: String, required: true, index: true },
  chapterId: { type: String, required: true, index: true },
  lessonId: { type: String, required: true, index: true },
  
  status: { 
    type: String, 
    enum: ['NOT_STARTED', 'IN_PROGRESS', 'COMPLETED'], 
    default: 'IN_PROGRESS' 
  },
  completionPercentage: { type: Number, default: 0, min: 0, max: 100 },
  scrollPosition: { type: Number, default: 0 },
  timeSpentSeconds: { type: Number, default: 0 },
  completedAt: { type: Date, default: null },
  lastAccessedAt: { type: Date, default: Date.now, index: true }
}, { timestamps: true });

// Prevent duplicate progress entries for the same user and lesson
learningProgressSchema.index({ userId: 1, lessonId: 1 }, { unique: true });

module.exports = mongoose.models.LearningProgress || mongoose.model('LearningProgress', learningProgressSchema);
