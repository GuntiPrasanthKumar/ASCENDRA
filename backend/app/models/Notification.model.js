const mongoose = require('mongoose');

const actionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  url: { type: String, required: true },
  payload: { type: Object, default: {} }
}, { _id: false });

const notificationSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true, 
    index: true 
  },
  title: { type: String, required: true },
  message: { type: String, required: true },
  priority: { 
    type: String, 
    enum: ['HIGH', 'MEDIUM', 'LOW'], 
    default: 'MEDIUM' 
  },
  category: { 
    type: String, 
    enum: ['ACADEMIC', 'PRACTICE', 'SECURITY', 'SYSTEM', 'ACHIEVEMENT'], 
    default: 'ACADEMIC',
    index: true
  },
  action: { type: actionSchema, required: true },
  expiry: { type: Date, required: true },
  deliveryChannel: { 
    type: String, 
    enum: ['IN_APP', 'EMAIL', 'PUSH'], 
    default: 'IN_APP' 
  },
  isRead: { type: Boolean, default: false, index: true },
  createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.models.Notification || mongoose.model('Notification', notificationSchema);
