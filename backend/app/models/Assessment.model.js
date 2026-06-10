const mongoose = require('mongoose');

const AssessmentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a title'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Please add a description']
  },
  department: {
    type: String,
    required: [true, 'Please specify a department'],
    enum: ['CSE', 'IT', 'ECE', 'DS', 'MECH', 'CIVIL']
  },
  subjectId: {
    type: String,
    required: [true, 'Please specify a subject ID']
  },
  difficulty: {
    type: String,
    required: [true, 'Please specify difficulty'],
    enum: ['easy', 'medium', 'hard']
  },
  durationMinutes: {
    type: Number,
    required: [true, 'Please specify duration in minutes']
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Reverse populate with virtuals
AssessmentSchema.virtual('questions', {
  ref: 'Question',
  localField: '_id',
  foreignField: 'assessment',
  justOne: false
});

module.exports = mongoose.model('Assessment', AssessmentSchema);
