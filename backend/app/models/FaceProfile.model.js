const mongoose = require('mongoose');

const faceProfileSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true, 
    unique: true, 
    index: true 
  },
  embeddingCipher: { type: String, required: true },
  iv: { type: String, required: true },
  authTag: { type: String, required: true },
  embeddingModelVersion: { 
    type: String, 
    default: 'mediapipe-face-embedder-v1',
    required: true
  },
  enrolledAt: { type: Date, default: Date.now },
  lastVerifiedAt: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.models.FaceProfile || mongoose.model('FaceProfile', faceProfileSchema);
