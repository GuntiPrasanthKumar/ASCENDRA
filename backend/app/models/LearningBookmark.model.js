const mongoose = require('mongoose');

const learningBookmarkSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true, 
    index: true 
  },
  subjectId: { type: String, required: true },
  chapterId: { type: String, required: true },
  lessonId: { type: String, required: true, index: true },
  blockId: { type: String, default: null },
  note: { type: String, default: '' }
}, { timestamps: true });

learningBookmarkSchema.index({ userId: 1, lessonId: 1, blockId: 1 }, { unique: true });

module.exports = mongoose.models.LearningBookmark || mongoose.model('LearningBookmark', learningBookmarkSchema);
