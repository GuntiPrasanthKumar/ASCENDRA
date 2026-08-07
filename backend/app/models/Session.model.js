const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true, 
    index: true 
  },
  refreshTokenHash: { type: String, required: true, index: true },
  deviceId: { type: String, default: 'unknown_device' },
  ipAddress: { type: String, default: '127.0.0.1' },
  userAgent: { type: String, default: 'unknown_browser' },
  isRevoked: { type: Boolean, default: false, index: true },
  expiresAt: { type: Date, required: true, index: true },
  lastActiveAt: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.models.Session || mongoose.model('Session', sessionSchema);
