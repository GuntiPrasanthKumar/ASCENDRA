const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema({
  actorId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true, 
    index: true 
  },
  actorEmail: { type: String, required: true },
  action: { type: String, required: true, index: true }, // e.g. "UPDATE_USER_ROLE", "TOGGLE_FEATURE_FLAG"
  target: { type: String, required: true },
  details: { type: Object, default: {} },
  ipAddress: { type: String, default: '127.0.0.1' },
  createdAt: { type: Date, default: Date.now, index: true }
}, { timestamps: true });

module.exports = mongoose.models.AuditLog || mongoose.model('AuditLog', auditLogSchema);
