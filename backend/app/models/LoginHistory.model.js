const mongoose = require('mongoose');

const loginHistorySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true, default: null },
  email: { type: String, required: true, lowercase: true, trim: true, index: true },
  method: { 
    type: String, 
    enum: ['PASSWORD', 'FACE', 'REFRESH_TOKEN'], 
    default: 'PASSWORD' 
  },
  status: { 
    type: String, 
    enum: ['SUCCESS', 'FAILED', 'LOCKED_OUT'], 
    required: true 
  },
  ipAddress: { type: String, default: '127.0.0.1' },
  userAgent: { type: String, default: 'unknown' },
  failureReason: { type: String, default: null },
  createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.models.LoginHistory || mongoose.model('LoginHistory', loginHistorySchema);
