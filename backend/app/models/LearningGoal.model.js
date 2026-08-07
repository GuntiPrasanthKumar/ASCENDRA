const mongoose = require('mongoose');

const learningGoalSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true, 
    index: true 
  },
  title: { type: String, required: true },
  targetSubjectId: { type: String, required: true },
  targetCompletionDate: { type: Date, required: true },
  dailyStudyTimeGoalMinutes: { type: Number, default: 30 },
  status: { 
    type: String, 
    enum: ['ACTIVE', 'COMPLETED', 'EXPIRED'], 
    default: 'ACTIVE' 
  },
  progressPercentage: { type: Number, default: 0, min: 0, max: 100 }
}, { timestamps: true });

module.exports = mongoose.models.LearningGoal || mongoose.model('LearningGoal', learningGoalSchema);
