const mongoose = require('mongoose');

const learningNoteSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true, 
    index: true 
  },
  subjectId: { type: String, required: true },
  lessonId: { type: String, required: true, index: true },
  content: { type: String, required: true },
  aiSummary: { type: String, default: null },
  tags: [{ type: String }]
}, { timestamps: true });

module.exports = mongoose.models.LearningNote || mongoose.model('LearningNote', learningNoteSchema);
