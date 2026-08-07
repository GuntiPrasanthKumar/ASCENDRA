const mongoose = require('mongoose');

const learningGraphNodeSchema = new mongoose.Schema({
  subjectId: { type: String, required: true, index: true },
  chapterId: { type: String, required: true, index: true },
  lessonId: { type: String, required: true, unique: true, index: true },
  topic: { type: String, required: true },
  difficulty: { type: String, enum: ['Easy', 'Medium', 'Pro'], default: 'Medium' },
  prerequisites: [{ type: String }], // Array of prerequisite lessonIds
  masteryThreshold: { type: Number, default: 80 },
  estimatedMinutes: { type: Number, default: 15 },
  pointsAwarded: { type: Number, default: 50 }
}, { timestamps: true });

module.exports = mongoose.models.LearningGraphNode || mongoose.model('LearningGraphNode', learningGraphNodeSchema);
