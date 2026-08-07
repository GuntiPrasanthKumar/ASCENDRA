const mongoose = require('mongoose');

const evidenceItemSchema = new mongoose.Schema({
  evidenceId: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  engine: { type: String, enum: ['IDENTITY', 'BEHAVIOR', 'ENVIRONMENT', 'INTEGRITY'], required: true },
  violationType: { type: String, required: true },
  severity: { type: String, enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'], default: 'MEDIUM' },
  metadata: { type: mongoose.Schema.Types.Mixed, default: {} }
}, { _id: false });

const proctorReportSchema = new mongoose.Schema({
  sessionId: { type: String, required: true, unique: true, index: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  subject: { type: String, default: 'General' },
  topic: { type: String, default: 'Assessment' },
  integrityScore: { type: Number, required: true, min: 0, max: 100 },
  riskStatus: { type: String, enum: ['LOW_RISK', 'MEDIUM_RISK', 'HIGH_RISK'], required: true },
  recommendation: { type: String, required: true },
  strikes: { type: Number, default: 0 },
  categoryBreakdown: {
    identityScore: { type: Number, default: 100 },
    behaviorScore: { type: Number, default: 100 },
    environmentScore: { type: Number, default: 100 }
  },
  evidences: [evidenceItemSchema],
  generatedAt: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.models.ProctorReport || mongoose.model('ProctorReport', proctorReportSchema);
