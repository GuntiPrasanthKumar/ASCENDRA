const mongoose = require('mongoose');

const lessonSchema = new mongoose.Schema({
  lessonId: { type: String, required: true },
  title: { type: String, required: true },
  content: { type: String, default: '' },
  status: { type: String, enum: ['DRAFT_REQUIRES_REVIEW', 'PUBLISHED'], default: 'DRAFT_REQUIRES_REVIEW' },
  aiGenerated: { type: Boolean, default: false }
}, { _id: false });

const courseSchema = new mongoose.Schema({
  facultyId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true, 
    index: true 
  },
  title: { type: String, required: true },
  category: { type: String, default: 'Computer Science' },
  description: { type: String, default: '' },
  lessons: [lessonSchema],
  published: { type: Boolean, default: false },
  enrolledStudentsCount: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.models.Course || mongoose.model('Course', courseSchema);
