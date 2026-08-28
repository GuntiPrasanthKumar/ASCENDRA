const mongoose = require('mongoose');

const aiReportSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true, 
    index: true 
  },
  reportType: { 
    type: String, 
    enum: ['WEEKLY', 'MONTHLY', 'CAREER_FORECAST'], 
    required: true 
  },
  periodKey: { type: String, required: true }, // e.g. "2026-W32" or "2026-M08"
  executiveSummary: { type: String, required: true },
  highlights: [{ type: String }],
  studyHours: { type: Number, default: 0 },
  accuracyRate: { type: Number, default: 85 },
  placementProbability: { type: Number, default: 88 },
  decayingSkills: [{ type: String }],
  masteredSkills: [{ type: String }],
  actionPlan: [{ type: String }],
  generatedAt: { type: Date, default: Date.now }
}, { timestamps: true });

// Prevent duplicate reports for the same user, type, and periodKey
aiReportSchema.index({ userId: 1, reportType: 1, periodKey: 1 }, { unique: true });

module.exports = mongoose.models.AIReport || mongoose.model('AIReport', aiReportSchema);
