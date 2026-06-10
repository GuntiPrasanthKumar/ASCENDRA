const mongoose = require('mongoose');

const ProctoringLogSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  assessment: {
    type: mongoose.Schema.ObjectId,
    ref: 'Assessment'
  },
  attempt: {
    type: mongoose.Schema.ObjectId,
    ref: 'StudentAttempt'
  },
  eventType: {
    type: String,
    required: [true, 'Please specify event type'],
    enum: ['MULTIPLE_FACES', 'FACE_NOT_DETECTED', 'FACE_MOVEMENT', 'EYE_BLINK_ANOMALY', 'TAB_SWITCH', 'FULLSCREEN_EXIT', 'EXTENSION_DETECTED']
  },
  severity: {
    type: String,
    enum: ['LOW', 'MEDIUM', 'HIGH'],
    default: 'LOW'
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('ProctoringLog', ProctoringLogSchema);
