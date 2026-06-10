const mongoose = require('mongoose');

const QuestionSchema = new mongoose.Schema({
  assessment: {
    type: mongoose.Schema.ObjectId,
    ref: 'Assessment',
    required: true
  },
  subject: {
    type: String,
    required: true
  },
  topic: {
    type: String,
    required: true
  },
  text: {
    type: String,
    required: [true, 'Please add question text']
  },
  options: {
    type: [String],
    required: function() { return this.type === 'multiple_choice'; }
  },
  correctOptionIndex: {
    type: Number,
    required: function() { return this.type === 'multiple_choice'; }
  },
  correctAnswer: {
    type: String, // For Fill in the Blanks and Short Answer (reference)
    required: function() { return this.type === 'fill_in_the_blanks' || this.type === 'short_answer'; }
  },
  points: {
    type: Number,
    default: 10
  },
  explanation: {
    type: String
  },
  type: {
    type: String,
    enum: ['multiple_choice', 'fill_in_the_blanks', 'short_answer', 'coding'],
    default: 'multiple_choice'
  },
  bloomsLevel: {
    type: String,
    enum: ['Remember', 'Understand', 'Apply', 'Analyze', 'Evaluate', 'Create'],
    default: 'Remember'
  }
});

function arrayLimit(val) {
  return val.length >= 2;
}

module.exports = mongoose.model('Question', QuestionSchema);
