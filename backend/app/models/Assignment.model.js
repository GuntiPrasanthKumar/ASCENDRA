const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  studentName: { type: String, default: 'Student' },
  solutionText: { type: String, required: true },
  aiSuggestedGrade: { type: Number, default: 85 },
  aiFeedback: { type: String, default: '' },
  finalConfirmedGrade: { type: Number, default: null },
  confirmedByFaculty: { type: Boolean, default: false },
  submittedAt: { type: Date, default: Date.now }
}, { _id: false });

const assignmentSchema = new mongoose.Schema({
  facultyId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true, 
    index: true 
  },
  title: { type: String, required: true },
  batchName: { type: String, default: 'CS-2026-A' },
  dueDate: { type: Date, required: true },
  submissions: [submissionSchema]
}, { timestamps: true });

module.exports = mongoose.models.Assignment || mongoose.model('Assignment', assignmentSchema);
